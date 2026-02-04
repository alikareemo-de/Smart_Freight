namespace Smart_Freight.Server.Dtos.Graph;

public sealed class GraphEdgeResponse
{
    public Guid Id { get; init; }
    public Guid FromNodeId { get; init; }
    public Guid ToNodeId { get; init; }
    public decimal Weight { get; init; }
    public bool IsBidirectional { get; init; }
}
