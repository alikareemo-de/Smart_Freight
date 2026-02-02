namespace Smart_Freight.Server.Dtos.Products;

public sealed class ProductResponse
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Sku { get; init; }
    public decimal UnitWeightKg { get; init; }
    public int AvailableQuantity { get; init; }
    public DateTimeOffset CreatedAt { get; init; }
}
