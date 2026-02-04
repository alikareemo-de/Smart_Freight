namespace Smart_Freight.Server.Dtos.Trips;

public sealed class TripCargoItemRequest
{
    public Guid ProductId { get; init; }
    public int Quantity { get; init; }
}
