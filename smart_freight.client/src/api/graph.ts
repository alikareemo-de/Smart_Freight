import { httpClient } from './http';
import type { GraphEdge, GraphEdgeCreateRequest, GraphNode, GraphNodeCreateRequest } from '../types/graph';

export const fetchGraphNodes = async () => {
    const { data } = await httpClient.get<GraphNode[]>('/api/graph/nodes');
    return data;
};

export const createGraphNode = async (payload: GraphNodeCreateRequest) => {
    const { data } = await httpClient.post<GraphNode>('/api/graph/nodes', payload);
    return data;
};

export const fetchGraphEdges = async () => {
    const { data } = await httpClient.get<GraphEdge[]>('/api/graph/edges');
    return data;
};

export const createGraphEdge = async (payload: GraphEdgeCreateRequest) => {
    const { data } = await httpClient.post<GraphEdge>('/api/graph/edges', payload);
    return data;
};
