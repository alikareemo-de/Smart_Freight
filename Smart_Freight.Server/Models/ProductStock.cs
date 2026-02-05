namespace Smart_Freight.Server.Models;

public class ProductStock
{
    public Guid ProductId { get; set; }
    public int AvailableQuantity { get; set; }
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public Product Product { get; set; } = null!;
}
