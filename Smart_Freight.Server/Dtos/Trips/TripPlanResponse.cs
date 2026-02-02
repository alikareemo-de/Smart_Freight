namespace Smart_Freight.Server.Dtos.Trips;

public sealed class TripPlanResponse
{
    public Guid TripId { get; init; }
    public decimal TotalWeightKg { get; init; }
    public decimal TotalPlannedDistance { get; init; }
    public List<TripStopResponse> Stops { get; init; } = [];
    public List<TripRouteStepResponse> RouteSteps { get; init; } = [];
}
