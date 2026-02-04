namespace Smart_Freight.Server.Models;

public class StopLocation
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? AddressText { get; set; }
    public Guid GraphNodeId { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public GraphNode GraphNode { get; set; } = null!;
}
