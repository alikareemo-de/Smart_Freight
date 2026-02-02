namespace Smart_Freight.Server.Dtos.Trips;

public sealed class TripPlanRequest
{
    public Guid TruckId { get; init; }
    public Guid StartNodeId { get; init; }
    public List<TripCargoItemRequest> CargoItems { get; init; } = [];
    public List<Guid> StopLocationIds { get; init; } = [];
}
