namespace Smart_Freight.Server.Dtos.Trips;

public sealed class TripCargoResponse
{
    public Guid ProductId { get; init; }
    public string ProductName { get; init; } = string.Empty;
    public int Quantity { get; init; }
    public decimal TotalWeightKg { get; init; }
}
