using Smart_Freight.Server.Models;

namespace Smart_Freight.Server.Services;

public class GraphPathfinder
{
    public IReadOnlyList<RouteEdge> ComputeShortestPath(
        Guid startNodeId,
        Guid endNodeId,
        IReadOnlyList<GraphEdge> edges)
    {
        var adjacency = BuildAdjacency(edges);
        var distances = new Dictionary<Guid, decimal>();
        var previous = new Dictionary<Guid, RouteEdge?>();
        var queue = new PriorityQueue<Guid, decimal>();

        distances[startNodeId] = 0m;
        queue.Enqueue(startNodeId, 0m);

        while (queue.Count > 0)
        {
            var current = queue.Dequeue();
            if (current == endNodeId)
            {
                break;
            }

            if (!adjacency.TryGetValue(current, out var neighbors))
            {
                continue;
            }

            foreach (var edge in neighbors)
            {
                var next = edge.ToNodeId;
                var tentative = distances[current] + edge.Weight;
                if (!distances.TryGetValue(next, out var existing) || tentative < existing)
                {
                    distances[next] = tentative;
                    previous[next] = edge;
                    queue.Enqueue(next, tentative);
                }
            }
        }

        if (!distances.ContainsKey(endNodeId))
        {
            throw new InvalidOperationException("No path found between the selected nodes.");
        }

        var path = new List<RouteEdge>();
        var cursor = endNodeId;
        while (cursor != startNodeId)
        {
            if (!previous.TryGetValue(cursor, out var edge) || edge is null)
            {
                break;
            }

            path.Add(edge);
            cursor = edge.FromNodeId;
        }

        path.Reverse();
        return path;
    }

    private static Dictionary<Guid, List<RouteEdge>> BuildAdjacency(IReadOnlyList<GraphEdge> edges)
    {
        var adjacency = new Dictionary<Guid, List<RouteEdge>>();

        foreach (var edge in edges)
        {
            AddEdge(adjacency, new RouteEdge(edge.FromNodeId, edge.ToNodeId, edge.Weight));
            if (edge.IsBidirectional)
            {
                AddEdge(adjacency, new RouteEdge(edge.ToNodeId, edge.FromNodeId, edge.Weight));
            }
        }

        return adjacency;
    }

    private static void AddEdge(Dictionary<Guid, List<RouteEdge>> adjacency, RouteEdge edge)
    {
        if (!adjacency.TryGetValue(edge.FromNodeId, out var list))
        {
            list = new List<RouteEdge>();
            adjacency[edge.FromNodeId] = list;
        }

        list.Add(edge);
    }
}

public sealed record RouteEdge(Guid FromNodeId, Guid ToNodeId, decimal Weight);
