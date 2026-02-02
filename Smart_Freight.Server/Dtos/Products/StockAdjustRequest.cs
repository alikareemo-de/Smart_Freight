namespace Smart_Freight.Server.Dtos.Products;

public sealed class StockAdjustRequest
{
    public int QuantityChange { get; init; }
    public string Reason { get; init; } = "ManualAdjustment";
}
