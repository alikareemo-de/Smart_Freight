namespace Smart_Freight.Server.Dtos.Products;

public sealed class StockResponse
{
    public Guid ProductId { get; init; }
    public int AvailableQuantity { get; init; }
    public DateTimeOffset UpdatedAt { get; init; }
}
