namespace Smart_Freight.Server.Models;

public class TripCargoItem
{
    public Guid Id { get; set; }
    public Guid TripId { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal TotalWeightKg { get; set; }

    public Trip Trip { get; set; } = null!;
    public Product Product { get; set; } = null!;
}
