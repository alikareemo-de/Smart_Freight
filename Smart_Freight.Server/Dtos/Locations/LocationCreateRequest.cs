namespace Smart_Freight.Server.Dtos.Locations;

public sealed class LocationCreateRequest
{
    public string Name { get; init; } = string.Empty;
    public string? AddressText { get; init; }
    public Guid GraphNodeId { get; init; }
    public decimal? Latitude { get; init; }
    public decimal? Longitude { get; init; }
}
