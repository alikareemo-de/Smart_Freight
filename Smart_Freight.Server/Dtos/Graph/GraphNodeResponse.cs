namespace Smart_Freight.Server.Dtos.Graph;

public sealed class GraphNodeResponse
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public decimal? Latitude { get; init; }
    public decimal? Longitude { get; init; }
}
