namespace Smart_Freight.Server.Dtos.Trips;

public sealed class TripRouteStepResponse
{
    public int StepOrder { get; init; }
    public Guid FromNodeId { get; init; }
    public Guid ToNodeId { get; init; }
    public decimal EdgeWeight { get; init; }
    public decimal CumulativeWeight { get; init; }
}
