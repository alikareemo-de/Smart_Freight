using Smart_Freight.Server.Models;

namespace Smart_Freight.Server.Services;

public interface IRoutingService
{
    Task<IReadOnlyList<RouteEdge>> GetShortestPathAsync(Guid startNodeId, Guid endNodeId, CancellationToken cancellationToken);
}
