namespace Smart_Freight.Server.Models;

public class TripStop
{
    public Guid Id { get; set; }
    public Guid TripId { get; set; }
    public Guid StopLocationId { get; set; }
    public int StopOrder { get; set; }
    public DateTimeOffset? PlannedArrivalTime { get; set; }
    public DateTimeOffset? ActualArrivalTime { get; set; }
    public TripStopStatus Status { get; set; } = TripStopStatus.Pending;
    public string? Notes { get; set; }

    public Trip Trip { get; set; } = null!;
    public StopLocation StopLocation { get; set; } = null!;
}
