using Smart_Freight.Server.Models;

namespace Smart_Freight.Server.Services;

public interface ITokenService
{
    Task<(string token, DateTimeOffset expiresAt)> CreateTokenAsync(ApplicationUser user);
}
