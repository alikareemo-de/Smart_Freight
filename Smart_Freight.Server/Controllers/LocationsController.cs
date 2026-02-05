using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Freight.Server.Data;
using Smart_Freight.Server.Dtos.Locations;
using Smart_Freight.Server.Models;

namespace Smart_Freight.Server.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(Roles = "Admin,Dispatcher")]
public class LocationsController : ControllerBase
{
    private readonly SmartFreightDbContext _dbContext;

    public LocationsController(SmartFreightDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LocationResponse>>> GetLocations(CancellationToken cancellationToken)
    {
        var locations = await _dbContext.StopLocations
            .AsNoTracking()
            .OrderBy(location => location.Name)
            .Select(location => new LocationResponse
            {
                Id = location.Id,
                Name = location.Name,
                AddressText = location.AddressText,
                GraphNodeId = location.GraphNodeId,
                Latitude = location.Latitude,
                Longitude = location.Longitude,
                CreatedAt = location.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return Ok(locations);
    }

    [HttpPost]
    public async Task<ActionResult<LocationResponse>> CreateLocation(
        LocationCreateRequest request,
        CancellationToken cancellationToken)
    {
        var nodeExists = await _dbContext.GraphNodes.AnyAsync(node => node.Id == request.GraphNodeId, cancellationToken);
        if (!nodeExists)
        {
            return BadRequest(new { message = "Graph node does not exist." });
        }

        var location = new StopLocation
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            AddressText = request.AddressText,
            GraphNodeId = request.GraphNodeId,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.StopLocations.Add(location);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetLocation), new { id = location.Id }, new LocationResponse
        {
            Id = location.Id,
            Name = location.Name,
            AddressText = location.AddressText,
            GraphNodeId = location.GraphNodeId,
            Latitude = location.Latitude,
            Longitude = location.Longitude,
            CreatedAt = location.CreatedAt
        });
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<LocationResponse>> GetLocation(Guid id, CancellationToken cancellationToken)
    {
        var location = await _dbContext.StopLocations.AsNoTracking().FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (location is null)
        {
            return NotFound();
        }

        return Ok(new LocationResponse
        {
            Id = location.Id,
            Name = location.Name,
            AddressText = location.AddressText,
            GraphNodeId = location.GraphNodeId,
            Latitude = location.Latitude,
            Longitude = location.Longitude,
            CreatedAt = location.CreatedAt
        });
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<LocationResponse>> UpdateLocation(
        Guid id,
        LocationUpdateRequest request,
        CancellationToken cancellationToken)
    {
        var location = await _dbContext.StopLocations.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (location is null)
        {
            return NotFound();
        }

        var nodeExists = await _dbContext.GraphNodes.AnyAsync(node => node.Id == request.GraphNodeId, cancellationToken);
        if (!nodeExists)
        {
            return BadRequest(new { message = "Graph node does not exist." });
        }

        location.Name = request.Name;
        location.AddressText = request.AddressText;
        location.GraphNodeId = request.GraphNodeId;
        location.Latitude = request.Latitude;
        location.Longitude = request.Longitude;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new LocationResponse
        {
            Id = location.Id,
            Name = location.Name,
            AddressText = location.AddressText,
            GraphNodeId = location.GraphNodeId,
            Latitude = location.Latitude,
            Longitude = location.Longitude,
            CreatedAt = location.CreatedAt
        });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteLocation(Guid id, CancellationToken cancellationToken)
    {
        var location = await _dbContext.StopLocations.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (location is null)
        {
            return NotFound();
        }

        _dbContext.StopLocations.Remove(location);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
