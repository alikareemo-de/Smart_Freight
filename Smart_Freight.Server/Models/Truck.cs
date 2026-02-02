namespace Smart_Freight.Server.Models;

public class Truck
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string PlateNumber { get; set; } = string.Empty;
    public decimal MaxPayloadKg { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
