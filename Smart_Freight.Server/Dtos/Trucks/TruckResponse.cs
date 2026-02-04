namespace Smart_Freight.Server.Dtos.Trucks;

public sealed class TruckResponse
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string PlateNumber { get; init; } = string.Empty;
    public decimal MaxPayloadKg { get; init; }
    public bool IsActive { get; init; }
    public DateTimeOffset CreatedAt { get; init; }
}
