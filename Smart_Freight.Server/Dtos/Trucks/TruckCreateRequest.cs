namespace Smart_Freight.Server.Dtos.Trucks;

public sealed class TruckCreateRequest
{
    public string Name { get; init; } = string.Empty;
    public string PlateNumber { get; init; } = string.Empty;
    public decimal MaxPayloadKg { get; init; }
    public bool IsActive { get; init; } = true;
}
