namespace Smart_Freight.Server.Dtos.Graph;

public sealed class GraphNodeCreateRequest
{
    public string Name { get; init; } = string.Empty;
    public decimal? Latitude { get; init; }
    public decimal? Longitude { get; init; }
}
