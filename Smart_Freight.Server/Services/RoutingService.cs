using Microsoft.EntityFrameworkCore;
using Smart_Freight.Server.Data;
using Smart_Freight.Server.Models;

namespace Smart_Freight.Server.Services;

public class RoutingService : IRoutingService
{
    private readonly SmartFreightDbContext _dbContext;
    private readonly GraphPathfinder _pathfinder;

    public RoutingService(SmartFreightDbContext dbContext, GraphPathfinder pathfinder)
    {
        _dbContext = dbContext;
        _pathfinder = pathfinder;
    }

    public async Task<IReadOnlyList<RouteEdge>> GetShortestPathAsync(
        Guid startNodeId,
        Guid endNodeId,
        CancellationToken cancellationToken)
    {
        var edges = await _dbContext.GraphEdges.AsNoTracking().ToListAsync(cancellationToken);
        return _pathfinder.ComputeShortestPath(startNodeId, endNodeId, edges);
    }
}
