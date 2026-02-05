using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Smart_Freight.Server.Data;
using Smart_Freight.Server.Models;
using Smart_Freight.Server.Options;

namespace Smart_Freight.Server.Services;

public class TokenService : ITokenService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SmartFreightDbContext _dbContext;
    private readonly JwtOptions _jwtOptions;
    private readonly ILogger<TokenService> _logger;

    public TokenService(
        UserManager<ApplicationUser> userManager,
        SmartFreightDbContext dbContext,
        ILogger<TokenService> logger,
        IOptions<JwtOptions> jwtOptions)
    {
        _userManager = userManager;
        _dbContext = dbContext;
        _logger = logger;
        _jwtOptions = jwtOptions.Value;
    }

    public async Task<(string token, DateTimeOffset expiresAt)> CreateTokenAsync(ApplicationUser user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.UserName ?? string.Empty)
        };

        var roles = await _userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        if (roles.Contains("Driver"))
        {
            var driverId = await _dbContext.Drivers
                .AsNoTracking()
                .Where(driver => driver.UserId == user.Id)
                .Select(driver => driver.Id)
                .FirstOrDefaultAsync();

            if (driverId == Guid.Empty)
            {
                throw new InvalidOperationException("Driver profile not found.");
            }

            claims.Add(new Claim("driver_id", driverId.ToString()));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SigningKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTimeOffset.UtcNow.AddMinutes(_jwtOptions.ExpiresMinutes);

        _logger.LogInformation(
            "Generating JWT with claims: {Claims}",
            string.Join(", ", claims.Select(claim => $"{claim.Type}={claim.Value}")));

        var token = new JwtSecurityToken(
            issuer: _jwtOptions.Issuer,
            audience: _jwtOptions.Audience,
            claims: claims,
            expires: expiresAt.UtcDateTime,
            signingCredentials: creds);

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }
}
