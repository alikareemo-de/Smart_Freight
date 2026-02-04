namespace Smart_Freight.Server.Dtos.Drivers;

public sealed class DriverUpdateRequest
{
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string? Email { get; init; }
    public string? PhoneNumber { get; init; }
    public string? LicenseNumber { get; init; }
    public bool IsActive { get; init; } = true;
}
