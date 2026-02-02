using Smart_Freight.Server.Models;
using Smart_Freight.Server.Services;
using Xunit;

namespace Smart_Freight.Tests;

public class GraphPathfinderTests
{
    [Fact]
    public void ComputeShortestPath_ReturnsShortestRoute()
    {
        var nodeA = Guid.NewGuid();
        var nodeB = Guid.NewGuid();
        var nodeC = Guid.NewGuid();
        var nodeD = Guid.NewGuid();

        var edges = new List<GraphEdge>
        {
            new() { Id = Guid.NewGuid(), FromNodeId = nodeA, ToNodeId = nodeB, Weight = 5m, IsBidirectional = true },
            new() { Id = Guid.NewGuid(), FromNodeId = nodeB, ToNodeId = nodeC, Weight = 2m, IsBidirectional = true },
            new() { Id = Guid.NewGuid(), FromNodeId = nodeA, ToNodeId = nodeC, Weight = 10m, IsBidirectional = true },
            new() { Id = Guid.NewGuid(), FromNodeId = nodeC, ToNodeId = nodeD, Weight = 1m, IsBidirectional = true }
        };

        var pathfinder = new GraphPathfinder();
        var path = pathfinder.ComputeShortestPath(nodeA, nodeD, edges);

        Assert.Equal(3, path.Count);
        Assert.Equal(nodeA, path[0].FromNodeId);
        Assert.Equal(nodeB, path[0].ToNodeId);
        Assert.Equal(5m, path[0].Weight);
        Assert.Equal(nodeB, path[1].FromNodeId);
        Assert.Equal(nodeC, path[1].ToNodeId);
        Assert.Equal(2m, path[1].Weight);
        Assert.Equal(nodeC, path[2].FromNodeId);
        Assert.Equal(nodeD, path[2].ToNodeId);
        Assert.Equal(1m, path[2].Weight);
    }
}
