namespace Smart_Freight.Server.Dtos.Auth;

public sealed class AuthResponse
{
    public string AccessToken { get; init; } = string.Empty;
    public DateTimeOffset ExpiresAt { get; init; }
    public string Email { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
}
