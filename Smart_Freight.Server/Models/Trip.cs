namespace Smart_Freight.Server.Models;

public class Trip
{
    public Guid Id { get; set; }
    public Guid TruckId { get; set; }
    public Guid DriverId { get; set; }
    public TripStatus Status { get; set; } = TripStatus.Waiting;
    public decimal TotalPlannedDistance { get; set; }
    public decimal? TotalPlannedCostOrTime { get; set; }
    public string CreatedByUserId { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? DoneAt { get; set; }

    public Truck Truck { get; set; } = null!;
    public Driver Driver { get; set; } = null!;
    public ApplicationUser CreatedByUser { get; set; } = null!;
    public ICollection<TripStop> Stops { get; set; } = new List<TripStop>();
    public ICollection<TripCargoItem> CargoItems { get; set; } = new List<TripCargoItem>();
    public ICollection<TripRouteStep> RouteSteps { get; set; } = new List<TripRouteStep>();
}
