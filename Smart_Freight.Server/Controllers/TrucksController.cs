using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Freight.Server.Data;
using Smart_Freight.Server.Dtos.Trucks;
using Smart_Freight.Server.Models;

namespace Smart_Freight.Server.Controllers;

[ApiController]
[Route("api/trucks")]
[Authorize(Roles = "Admin,Dispatcher")]
public class TrucksController : ControllerBase
{
    private readonly SmartFreightDbContext _dbContext;

    public TrucksController(SmartFreightDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TruckResponse>>> GetTrucks(CancellationToken cancellationToken)
    {
        var trucks = await _dbContext.Trucks.AsNoTracking()
            .OrderBy(truck => truck.Name)
            .Select(truck => new TruckResponse
            {
                Id = truck.Id,
                Name = truck.Name,
                PlateNumber = truck.PlateNumber,
                MaxPayloadKg = truck.MaxPayloadKg,
                IsActive = truck.IsActive,
                CreatedAt = truck.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return Ok(trucks);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TruckResponse>> GetTruck(Guid id, CancellationToken cancellationToken)
    {
        var truck = await _dbContext.Trucks.AsNoTracking().FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (truck is null)
        {
            return NotFound();
        }

        return Ok(new TruckResponse
        {
            Id = truck.Id,
            Name = truck.Name,
            PlateNumber = truck.PlateNumber,
            MaxPayloadKg = truck.MaxPayloadKg,
            IsActive = truck.IsActive,
            CreatedAt = truck.CreatedAt
        });
    }

    [HttpPost]
    public async Task<ActionResult<TruckResponse>> CreateTruck(TruckCreateRequest request, CancellationToken cancellationToken)
    {
        var truck = new Truck
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            PlateNumber = request.PlateNumber,
            MaxPayloadKg = request.MaxPayloadKg,
            IsActive = request.IsActive,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.Trucks.Add(truck);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetTruck), new { id = truck.Id }, new TruckResponse
        {
            Id = truck.Id,
            Name = truck.Name,
            PlateNumber = truck.PlateNumber,
            MaxPayloadKg = truck.MaxPayloadKg,
            IsActive = truck.IsActive,
            CreatedAt = truck.CreatedAt
        });
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TruckResponse>> UpdateTruck(
        Guid id,
        TruckUpdateRequest request,
        CancellationToken cancellationToken)
    {
        var truck = await _dbContext.Trucks.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (truck is null)
        {
            return NotFound();
        }

        truck.Name = request.Name;
        truck.PlateNumber = request.PlateNumber;
        truck.MaxPayloadKg = request.MaxPayloadKg;
        truck.IsActive = request.IsActive;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new TruckResponse
        {
            Id = truck.Id,
            Name = truck.Name,
            PlateNumber = truck.PlateNumber,
            MaxPayloadKg = truck.MaxPayloadKg,
            IsActive = truck.IsActive,
            CreatedAt = truck.CreatedAt
        });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTruck(Guid id, CancellationToken cancellationToken)
    {
        var truck = await _dbContext.Trucks.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (truck is null)
        {
            return NotFound();
        }

        _dbContext.Trucks.Remove(truck);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
