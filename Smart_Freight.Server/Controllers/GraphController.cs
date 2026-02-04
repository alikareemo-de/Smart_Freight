using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Freight.Server.Data;
using Smart_Freight.Server.Dtos.Graph;
using Smart_Freight.Server.Models;

namespace Smart_Freight.Server.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(Roles = "Admin,Dispatcher")]
public class GraphController : ControllerBase
{
    private readonly SmartFreightDbContext _dbContext;

    public GraphController(SmartFreightDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("nodes")]
    public async Task<ActionResult<IEnumerable<GraphNodeResponse>>> GetNodes(CancellationToken cancellationToken)
    {
        var nodes = await _dbContext.GraphNodes
            .AsNoTracking()
            .OrderBy(node => node.Name)
            .Select(node => new GraphNodeResponse
            {
                Id = node.Id,
                Name = node.Name,
                Latitude = node.Latitude,
                Longitude = node.Longitude
            })
            .ToListAsync(cancellationToken);

        return Ok(nodes);
    }

    [HttpPost("nodes")]
    public async Task<ActionResult<GraphNodeResponse>> CreateNode(GraphNodeCreateRequest request, CancellationToken cancellationToken)
    {
        var node = new GraphNode
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Latitude = request.Latitude,
            Longitude = request.Longitude
        };

        _dbContext.GraphNodes.Add(node);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new GraphNodeResponse
        {
            Id = node.Id,
            Name = node.Name,
            Latitude = node.Latitude,
            Longitude = node.Longitude
        });
    }

    [HttpGet("edges")]
    public async Task<ActionResult<IEnumerable<GraphEdgeResponse>>> GetEdges(CancellationToken cancellationToken)
    {
        var edges = await _dbContext.GraphEdges
            .AsNoTracking()
            .Select(edge => new GraphEdgeResponse
            {
                Id = edge.Id,
                FromNodeId = edge.FromNodeId,
                ToNodeId = edge.ToNodeId,
                Weight = edge.Weight,
                IsBidirectional = edge.IsBidirectional
            })
            .ToListAsync(cancellationToken);

        return Ok(edges);
    }

    [HttpPost("edges")]
    public async Task<ActionResult<GraphEdgeResponse>> CreateEdge(GraphEdgeCreateRequest request, CancellationToken cancellationToken)
    {
        var nodesExist = await _dbContext.GraphNodes
            .Where(node => node.Id == request.FromNodeId || node.Id == request.ToNodeId)
            .CountAsync(cancellationToken);

        if (nodesExist != 2)
        {
            return BadRequest(new { message = "Invalid graph node references." });
        }

        var edge = new GraphEdge
        {
            Id = Guid.NewGuid(),
            FromNodeId = request.FromNodeId,
            ToNodeId = request.ToNodeId,
            Weight = request.Weight,
            IsBidirectional = request.IsBidirectional
        };

        _dbContext.GraphEdges.Add(edge);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new GraphEdgeResponse
        {
            Id = edge.Id,
            FromNodeId = edge.FromNodeId,
            ToNodeId = edge.ToNodeId,
            Weight = edge.Weight,
            IsBidirectional = edge.IsBidirectional
        });
    }
}
