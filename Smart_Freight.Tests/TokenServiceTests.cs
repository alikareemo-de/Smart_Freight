using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Moq;
using Smart_Freight.Server.Data;
using Smart_Freight.Server.Models;
using Smart_Freight.Server.Options;
using Smart_Freight.Server.Services;
using Xunit;

namespace Smart_Freight.Tests;

public class TokenServiceTests
{
    [Fact]
    public async Task CreateTokenAsync_AddsDriverIdClaim_ForDriverRole()
    {
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid().ToString(),
            UserName = "driver.user",
            Email = "driver@test.com"
        };

        var driverId = Guid.NewGuid();
        await using var dbContext = CreateDbContext();
        dbContext.Drivers.Add(new Driver
        {
            Id = driverId,
            UserId = user.Id,
            FirstName = "Test",
            LastName = "Driver",
            IsActive = true
        });
        await dbContext.SaveChangesAsync();

        var userManager = CreateUserManagerMock(user, ["Driver"]);
        var service = CreateService(userManager.Object, dbContext);

        var (token, _) = await service.CreateTokenAsync(user);

        var jwt = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().ReadJwtToken(token);
        Assert.Contains(jwt.Claims, claim => claim.Type == "driver_id" && claim.Value == driverId.ToString());
    }

    [Fact]
    public async Task CreateTokenAsync_DoesNotAddDriverIdClaim_ForNonDriverRole()
    {
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid().ToString(),
            UserName = "dispatcher.user",
            Email = "dispatcher@test.com"
        };

        await using var dbContext = CreateDbContext();
        var userManager = CreateUserManagerMock(user, ["Dispatcher"]);
        var service = CreateService(userManager.Object, dbContext);

        var (token, _) = await service.CreateTokenAsync(user);

        var jwt = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().ReadJwtToken(token);
        Assert.DoesNotContain(jwt.Claims, claim => claim.Type == "driver_id");
    }

    private static SmartFreightDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<SmartFreightDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new SmartFreightDbContext(options);
    }

    private static Mock<UserManager<ApplicationUser>> CreateUserManagerMock(ApplicationUser user, IList<string> roles)
    {
        var store = new Mock<IUserStore<ApplicationUser>>();
        var manager = new Mock<UserManager<ApplicationUser>>(
            store.Object,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!);

        manager.Setup(item => item.GetRolesAsync(user)).ReturnsAsync(roles);
        return manager;
    }

    private static TokenService CreateService(UserManager<ApplicationUser> userManager, SmartFreightDbContext dbContext)
    {
        var options = Options.Create(new JwtOptions
        {
            Issuer = "issuer",
            Audience = "audience",
            SigningKey = "0123456789ABCDEF0123456789ABCDEF",
            ExpiresMinutes = 60
        });

        return new TokenService(userManager, dbContext, NullLogger<TokenService>.Instance, options);
    }
}
