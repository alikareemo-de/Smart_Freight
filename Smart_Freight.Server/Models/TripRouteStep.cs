namespace Smart_Freight.Server.Models;

public class TripRouteStep
{
    public Guid Id { get; set; }
    public Guid TripId { get; set; }
    public int StepOrder { get; set; }
    public Guid FromNodeId { get; set; }
    public Guid ToNodeId { get; set; }
    public decimal EdgeWeight { get; set; }
    public decimal CumulativeWeight { get; set; }

    public Trip Trip { get; set; } = null!;
    public GraphNode FromNode { get; set; } = null!;
    public GraphNode ToNode { get; set; } = null!;
}
