using Smart_Freight.Server.Dtos.Trips;

namespace Smart_Freight.Server.Services;

public interface ITripPlanningService
{
    Task<TripPlanResponse> PlanAndCreateTripAsync(
        TripPlanRequest request,
        string createdByUserId,
        CancellationToken cancellationToken);
}
