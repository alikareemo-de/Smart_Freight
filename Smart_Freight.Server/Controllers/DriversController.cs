using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Freight.Server.Data;
using Smart_Freight.Server.Dtos.Drivers;
using Smart_Freight.Server.Models;

namespace Smart_Freight.Server.Controllers;

[ApiController]
[Route("drivers")]
public class DriversController : ControllerBase
{
    private readonly SmartFreightDbContext _dbContext;

    public DriversController(SmartFreightDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Dispatcher")]
    public async Task<ActionResult<IEnumerable<DriverResponse>>> GetDrivers(CancellationToken cancellationToken)
    {
        var drivers = await _dbContext.Drivers
            .AsNoTracking()
            .OrderBy(driver => driver.LastName)
            .ThenBy(driver => driver.FirstName)
            .Select(driver => new DriverResponse
            {
                Id = driver.Id,
                FirstName = driver.FirstName,
                LastName = driver.LastName,
                Email = driver.Email,
                PhoneNumber = driver.PhoneNumber,
                LicenseNumber = driver.LicenseNumber,
                IsActive = driver.IsActive,
                CreatedAt = driver.CreatedAt,
                UpdatedAt = driver.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return Ok(drivers);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Admin,Dispatcher,Driver")]
    public async Task<ActionResult<DriverResponse>> GetDriver(Guid id, CancellationToken cancellationToken)
    {
        var driver = await _dbContext.Drivers
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

        if (driver is null)
        {
            return NotFound();
        }

        return Ok(new DriverResponse
        {
            Id = driver.Id,
            FirstName = driver.FirstName,
            LastName = driver.LastName,
            Email = driver.Email,
            PhoneNumber = driver.PhoneNumber,
            LicenseNumber = driver.LicenseNumber,
            IsActive = driver.IsActive,
            CreatedAt = driver.CreatedAt,
            UpdatedAt = driver.UpdatedAt
        });
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Dispatcher")]
    public async Task<ActionResult<DriverResponse>> CreateDriver(
        DriverCreateRequest request,
        CancellationToken cancellationToken)
    {
        var driver = new Driver
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            LicenseNumber = request.LicenseNumber,
            IsActive = request.IsActive,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.Drivers.Add(driver);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var response = new DriverResponse
        {
            Id = driver.Id,
            FirstName = driver.FirstName,
            LastName = driver.LastName,
            Email = driver.Email,
            PhoneNumber = driver.PhoneNumber,
            LicenseNumber = driver.LicenseNumber,
            IsActive = driver.IsActive,
            CreatedAt = driver.CreatedAt,
            UpdatedAt = driver.UpdatedAt
        };

        return CreatedAtAction(nameof(GetDriver), new { id = driver.Id }, response);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Dispatcher")]
    public async Task<ActionResult<DriverResponse>> UpdateDriver(
        Guid id,
        DriverUpdateRequest request,
        CancellationToken cancellationToken)
    {
        var driver = await _dbContext.Drivers.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (driver is null)
        {
            return NotFound();
        }

        driver.FirstName = request.FirstName;
        driver.LastName = request.LastName;
        driver.Email = request.Email;
        driver.PhoneNumber = request.PhoneNumber;
        driver.LicenseNumber = request.LicenseNumber;
        driver.IsActive = request.IsActive;
        driver.UpdatedAt = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new DriverResponse
        {
            Id = driver.Id,
            FirstName = driver.FirstName,
            LastName = driver.LastName,
            Email = driver.Email,
            PhoneNumber = driver.PhoneNumber,
            LicenseNumber = driver.LicenseNumber,
            IsActive = driver.IsActive,
            CreatedAt = driver.CreatedAt,
            UpdatedAt = driver.UpdatedAt
        });
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,Dispatcher")]
    public async Task<IActionResult> DeleteDriver(Guid id, CancellationToken cancellationToken)
    {
        var driver = await _dbContext.Drivers.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (driver is null)
        {
            return NotFound();
        }

        _dbContext.Drivers.Remove(driver);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
