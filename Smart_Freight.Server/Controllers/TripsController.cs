using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Freight.Server.Data;
using Smart_Freight.Server.Dtos.Trips;
using Smart_Freight.Server.Models;
using Smart_Freight.Server.Services;

namespace Smart_Freight.Server.Controllers;

[ApiController]
[Route("api/trips")]
public class TripsController : ControllerBase
{
    private readonly SmartFreightDbContext _dbContext;
    private readonly ITripPlanningService _tripPlanningService;

    public TripsController(SmartFreightDbContext dbContext, ITripPlanningService tripPlanningService)
    {
        _dbContext = dbContext;
        _tripPlanningService = tripPlanningService;
    }

    [HttpPost("plan-and-create")]
    [Authorize(Roles = "Admin,Dispatcher")]
    public async Task<ActionResult<TripPlanResponse>> PlanAndCreate(
        TripPlanRequest request,
        CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        var response = await _tripPlanningService.PlanAndCreateTripAsync(request, userId, cancellationToken);
        return Ok(response);
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Dispatcher")]
    public async Task<ActionResult<IEnumerable<TripSummaryResponse>>> GetTrips(CancellationToken cancellationToken)
    {
        var trips = await _dbContext.Trips
            .Include(trip => trip.Truck)
            .AsNoTracking()
            .OrderByDescending(trip => trip.CreatedAt)
            .Select(trip => new TripSummaryResponse
            {
                Id = trip.Id,
                TruckId = trip.TruckId,
                TruckName = trip.Truck.Name,
                Status = trip.Status.ToString(),
                TotalPlannedDistance = trip.TotalPlannedDistance,
                CreatedAt = trip.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return Ok(trips);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Admin,Dispatcher,Driver")]
    public async Task<ActionResult<TripDetailsResponse>> GetTrip(Guid id, CancellationToken cancellationToken)
    {
        var trip = await _dbContext.Trips
            .Include(item => item.Truck)
            .Include(item => item.Stops)
                .ThenInclude(stop => stop.StopLocation)
            .Include(item => item.CargoItems)
                .ThenInclude(cargo => cargo.Product)
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

        if (trip is null)
        {
            return NotFound();
        }

        return Ok(new TripDetailsResponse
        {
            Id = trip.Id,
            TruckId = trip.TruckId,
            TruckName = trip.Truck.Name,
            Status = trip.Status.ToString(),
            TotalPlannedDistance = trip.TotalPlannedDistance,
            CreatedAt = trip.CreatedAt,
            Stops = trip.Stops
                .OrderBy(stop => stop.StopOrder)
                .Select(stop => new TripStopResponse
                {
                    Id = stop.Id,
                    StopLocationId = stop.StopLocationId,
                    StopName = stop.StopLocation.Name,
                    StopOrder = stop.StopOrder,
                    Status = stop.Status.ToString()
                })
                .ToList(),
            CargoItems = trip.CargoItems
                .Select(item => new TripCargoResponse
                {
                    ProductId = item.ProductId,
                    ProductName = item.Product.Name,
                    Quantity = item.Quantity,
                    TotalWeightKg = item.TotalWeightKg
                })
                .ToList()
        });
    }

    [HttpGet("{id:guid}/route")]
    [Authorize(Roles = "Admin,Dispatcher,Driver")]
    public async Task<ActionResult<IEnumerable<TripRouteStepResponse>>> GetRoute(Guid id, CancellationToken cancellationToken)
    {
        var steps = await _dbContext.TripRouteSteps
            .AsNoTracking()
            .Where(step => step.TripId == id)
            .OrderBy(step => step.StepOrder)
            .Select(step => new TripRouteStepResponse
            {
                StepOrder = step.StepOrder,
                FromNodeId = step.FromNodeId,
                ToNodeId = step.ToNodeId,
                EdgeWeight = step.EdgeWeight,
                CumulativeWeight = step.CumulativeWeight
            })
            .ToListAsync(cancellationToken);

        if (steps.Count == 0)
        {
            return NotFound();
        }

        return Ok(steps);
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "Admin,Dispatcher")]
    public async Task<IActionResult> UpdateTripStatus(
        Guid id,
        TripStatusUpdateRequest request,
        CancellationToken cancellationToken)
    {
        var trip = await _dbContext.Trips.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (trip is null)
        {
            return NotFound();
        }

        if (!Enum.TryParse<TripStatus>(request.Status, true, out var status))
        {
            return BadRequest(new { message = "Invalid status." });
        }

        trip.Status = status;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPatch("{id:guid}/stops/{stopId:guid}/status")]
    [Authorize(Roles = "Admin,Dispatcher,Driver")]
    public async Task<IActionResult> UpdateStopStatus(
        Guid id,
        Guid stopId,
        TripStopStatusUpdateRequest request,
        CancellationToken cancellationToken)
    {
        var stop = await _dbContext.TripStops.FirstOrDefaultAsync(
            item => item.Id == stopId && item.TripId == id,
            cancellationToken);

        if (stop is null)
        {
            return NotFound();
        }

        if (!Enum.TryParse<TripStopStatus>(request.Status, true, out var status))
        {
            return BadRequest(new { message = "Invalid status." });
        }

        stop.Status = status;
        stop.Notes = request.Notes;
        stop.ActualArrivalTime = DateTimeOffset.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
