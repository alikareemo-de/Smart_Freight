namespace Smart_Freight.Server.Dtos.Products;

public sealed class ProductUpdateRequest
{
    public string Name { get; init; } = string.Empty;
    public string? Sku { get; init; }
    public decimal UnitWeightKg { get; init; }
}
