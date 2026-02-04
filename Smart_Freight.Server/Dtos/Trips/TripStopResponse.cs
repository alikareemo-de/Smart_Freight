namespace Smart_Freight.Server.Dtos.Trips;

public sealed class TripStopResponse
{
    public Guid Id { get; init; }
    public Guid StopLocationId { get; init; }
    public string StopName { get; init; } = string.Empty;
    public int StopOrder { get; init; }
    public string Status { get; init; } = string.Empty;
}
