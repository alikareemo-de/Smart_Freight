namespace Smart_Freight.Server.Dtos.Trips;

public sealed class TripStopStatusUpdateRequest
{
    public string Status { get; init; } = string.Empty;
    public string? Notes { get; init; }
}
