namespace Smart_Freight.Server.Dtos.Trips;

public sealed class TripSummaryResponse
{
    public Guid Id { get; init; }
    public Guid TruckId { get; init; }
    public string TruckName { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public decimal TotalPlannedDistance { get; init; }
    public DateTimeOffset CreatedAt { get; init; }
}
