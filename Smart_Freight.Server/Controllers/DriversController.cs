using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Freight.Server.Data;
using Smart_Freight.Server.Dtos.Drivers;
using Smart_Freight.Server.Dtos.Trips;
using Smart_Freight.Server.Models;

namespace Smart_Freight.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class DriversController : ControllerBase
{
    private readonly SmartFreightDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public DriversController(
        SmartFreightDbContext dbContext,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _roleManager = roleManager;
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

    [HttpGet("{driverId:guid}/trips")]
    [Authorize(Roles = "Admin,Dispatcher")]
    public async Task<ActionResult<IEnumerable<DriverTripResponse>>> GetDriverTrips(
        Guid driverId,
        [FromQuery] string? status,
        [FromQuery] DateTimeOffset? from,
        [FromQuery] DateTimeOffset? to,
        CancellationToken cancellationToken)
    {
        TripStatus? parsedStatus = null;
        if (!string.IsNullOrWhiteSpace(status))
        {
            if (!Enum.TryParse<TripStatus>(status, true, out var statusValue))
            {
                return BadRequest(new { message = "Invalid status." });
            }

            parsedStatus = statusValue;
        }

        var query = _dbContext.Trips
            .Include(trip => trip.Truck)
            .Include(trip => trip.Driver)
            .Include(trip => trip.Stops)
                .ThenInclude(stop => stop.StopLocation)
            .AsNoTracking()
            .Where(trip => trip.DriverId == driverId);

        if (parsedStatus.HasValue)
        {
            query = query.Where(trip => trip.Status == parsedStatus);
        }

        if (from.HasValue)
        {
            query = query.Where(trip => trip.CreatedAt >= from.Value);
        }

        if (to.HasValue)
        {
            query = query.Where(trip => trip.CreatedAt <= to.Value);
        }

        var trips = await query
            .OrderByDescending(trip => trip.CreatedAt)
            .Select(trip => new DriverTripResponse
            {
                Id = trip.Id,
                TruckId = trip.TruckId,
                TruckName = trip.Truck.Name,
                DriverId = trip.DriverId,
                DriverName = $"{trip.Driver.FirstName} {trip.Driver.LastName}",
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
                    .ToList()
            })
            .ToListAsync(cancellationToken);

        return Ok(trips);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Dispatcher")]
    public async Task<ActionResult<DriverResponse>> CreateDriver(
        DriverCreateRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.UserName))
        {
            return BadRequest(new { message = "Username is required." });
        }

        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);
        var userEmail = string.IsNullOrWhiteSpace(request.Email) ? request.UserName : request.Email;
        var user = new ApplicationUser
        {
            UserName = request.UserName,
            Email = userEmail,
            PhoneNumber = request.PhoneNumber,
            FullName = $"{request.FirstName} {request.LastName}".Trim(),
            EmailConfirmed = !string.IsNullOrWhiteSpace(userEmail),
            IsActive = request.IsActive
        };

        var userResult = await _userManager.CreateAsync(user, request.UserName);
        if (!userResult.Succeeded)
        {
            return BadRequest(userResult.Errors);
        }

        if (!await _roleManager.RoleExistsAsync("Driver"))
        {
            var roleResult = await _roleManager.CreateAsync(new IdentityRole("Driver"));
            if (!roleResult.Succeeded)
            {
                await _userManager.DeleteAsync(user);
                return BadRequest(roleResult.Errors);
            }
        }

        var roleAssignment = await _userManager.AddToRoleAsync(user, "Driver");
        if (!roleAssignment.Succeeded)
        {
            await _userManager.DeleteAsync(user);
            return BadRequest(roleAssignment.Errors);
        }

        var driver = new Driver
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            LicenseNumber = request.LicenseNumber,
            IsActive = request.IsActive,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.Drivers.Add(driver);
        try
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }
        catch (Exception)
        {
            await transaction.RollbackAsync(cancellationToken);
            await _userManager.DeleteAsync(user);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Unable to create driver." });
        }

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
