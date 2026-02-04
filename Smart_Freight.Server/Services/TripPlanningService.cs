using Microsoft.EntityFrameworkCore;
using Smart_Freight.Server.Data;
using Smart_Freight.Server.Dtos.Trips;
using Smart_Freight.Server.Models;

namespace Smart_Freight.Server.Services;

public class TripPlanningService : ITripPlanningService
{
    private readonly SmartFreightDbContext _dbContext;
    private readonly IRoutingService _routingService;

    public TripPlanningService(SmartFreightDbContext dbContext, IRoutingService routingService)
    {
        _dbContext = dbContext;
        _routingService = routingService;
    }

    public async Task<TripPlanResponse> PlanAndCreateTripAsync(
        TripPlanRequest request,
        string createdByUserId,
        CancellationToken cancellationToken)
    {
        if (request.StopLocationIds.Count == 0)
        {
            throw new InvalidOperationException("Trip must contain at least one stop.");
        }

        var truck = await _dbContext.Trucks.FirstOrDefaultAsync(item => item.Id == request.TruckId, cancellationToken);
        if (truck is null || !truck.IsActive)
        {
            throw new InvalidOperationException("Truck is not available.");
        }

        var driver = await _dbContext.Drivers.FirstOrDefaultAsync(item => item.Id == request.DriverId, cancellationToken);
        if (driver is null || !driver.IsActive)
        {
            throw new InvalidOperationException("Driver is not available.");
        }

        var stopLocations = await _dbContext.StopLocations
            .Include(location => location.GraphNode)
            .Where(location => request.StopLocationIds.Contains(location.Id))
            .ToListAsync(cancellationToken);

        if (stopLocations.Count != request.StopLocationIds.Count)
        {
            throw new InvalidOperationException("One or more stop locations are invalid.");
        }

        var startNodeExists = await _dbContext.GraphNodes.AnyAsync(node => node.Id == request.StartNodeId, cancellationToken);
        if (!startNodeExists)
        {
            throw new InvalidOperationException("Start node is invalid.");
        }

        var products = await _dbContext.Products
            .Include(product => product.Stock)
            .Where(product => request.CargoItems.Select(item => item.ProductId).Contains(product.Id))
            .ToListAsync(cancellationToken);

        if (products.Count != request.CargoItems.Count)
        {
            throw new InvalidOperationException("One or more products are invalid.");
        }

        var totalWeight = 0m;
        foreach (var item in request.CargoItems)
        {
            var product = products.First(product => product.Id == item.ProductId);
            if (product.Stock is null || product.Stock.AvailableQuantity < item.Quantity)
            {
                throw new InvalidOperationException($"Insufficient stock for {product.Name}.");
            }
            totalWeight += item.Quantity * product.UnitWeightKg;
        }

        if (totalWeight > truck.MaxPayloadKg)
        {
            throw new InvalidOperationException("Payload exceeds truck capacity.");
        }

        using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        var trip = new Trip
        {
            Id = Guid.NewGuid(),
            TruckId = truck.Id,
            DriverId = driver.Id,
            CreatedByUserId = createdByUserId,
            Status = TripStatus.Planned,
            CreatedAt = DateTimeOffset.UtcNow
        };
        _dbContext.Trips.Add(trip);

        var cargoItems = request.CargoItems.Select(item =>
        {
            var product = products.First(product => product.Id == item.ProductId);
            return new TripCargoItem
            {
                Id = Guid.NewGuid(),
                TripId = trip.Id,
                ProductId = product.Id,
                Quantity = item.Quantity,
                TotalWeightKg = item.Quantity * product.UnitWeightKg
            };
        }).ToList();
        _dbContext.TripCargoItems.AddRange(cargoItems);

        foreach (var item in request.CargoItems)
        {
            var stock = products.First(product => product.Id == item.ProductId).Stock!;
            stock.AvailableQuantity -= item.Quantity;
            stock.UpdatedAt = DateTimeOffset.UtcNow;
        }

        var orderedStops = request.StopLocationIds
            .Select((id, index) => new { id, index })
            .ToList();

        var tripStops = orderedStops.Select(item =>
        {
            var location = stopLocations.First(stop => stop.Id == item.id);
            return new TripStop
            {
                Id = Guid.NewGuid(),
                TripId = trip.Id,
                StopLocationId = location.Id,
                StopOrder = item.index + 1,
                Status = TripStopStatus.Pending
            };
        }).ToList();
        _dbContext.TripStops.AddRange(tripStops);

        var routeSteps = new List<TripRouteStep>();
        var currentNodeId = request.StartNodeId;
        var cumulative = 0m;
        var stepOrder = 1;

        foreach (var stop in orderedStops)
        {
            var location = stopLocations.First(item => item.Id == stop.id);
            var segment = await _routingService.GetShortestPathAsync(currentNodeId, location.GraphNodeId, cancellationToken);
            foreach (var edge in segment)
            {
                cumulative += edge.Weight;
                routeSteps.Add(new TripRouteStep
                {
                    Id = Guid.NewGuid(),
                    TripId = trip.Id,
                    StepOrder = stepOrder++,
                    FromNodeId = edge.FromNodeId,
                    ToNodeId = edge.ToNodeId,
                    EdgeWeight = edge.Weight,
                    CumulativeWeight = cumulative
                });
            }

            currentNodeId = location.GraphNodeId;
        }

        trip.TotalPlannedDistance = cumulative;
        _dbContext.TripRouteSteps.AddRange(routeSteps);

        await _dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return new TripPlanResponse
        {
            TripId = trip.Id,
            TotalWeightKg = totalWeight,
            TotalPlannedDistance = trip.TotalPlannedDistance,
            Stops = tripStops
                .OrderBy(stop => stop.StopOrder)
                .Select(stop => new TripStopResponse
                {
                    Id = stop.Id,
                    StopLocationId = stop.StopLocationId,
                    StopName = stopLocations.First(location => location.Id == stop.StopLocationId).Name,
                    StopOrder = stop.StopOrder,
                    Status = stop.Status.ToString()
                })
                .ToList(),
            RouteSteps = routeSteps
                .OrderBy(step => step.StepOrder)
                .Select(step => new TripRouteStepResponse
                {
                    StepOrder = step.StepOrder,
                    FromNodeId = step.FromNodeId,
                    ToNodeId = step.ToNodeId,
                    EdgeWeight = step.EdgeWeight,
                    CumulativeWeight = step.CumulativeWeight
                })
                .ToList()
        };
    }
}
