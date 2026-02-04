namespace Smart_Freight.Server.Models;

public class GraphEdge
{
    public Guid Id { get; set; }
    public Guid FromNodeId { get; set; }
    public Guid ToNodeId { get; set; }
    public decimal Weight { get; set; }
    public bool IsBidirectional { get; set; } = true;

    public GraphNode FromNode { get; set; } = null!;
    public GraphNode ToNode { get; set; } = null!;
}
