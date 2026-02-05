import { httpClient } from './http';
import type { GraphEdge, GraphEdgeCreateRequest, GraphNode, GraphNodeCreateRequest } from '../types/graph';

export const fetchGraphNodes = async () => {
    const { data } = await httpClient.get<GraphNode[]>('/graph/nodes');
    return data;
};

export const createGraphNode = async (payload: GraphNodeCreateRequest) => {
    const { data } = await httpClient.post<GraphNode>('/graph/nodes', payload);
    return data;
};

export const fetchGraphEdges = async () => {
    const { data } = await httpClient.get<GraphEdge[]>('/graph/edges');
    return data;
};

export const createGraphEdge = async (payload: GraphEdgeCreateRequest) => {
    const { data } = await httpClient.post<GraphEdge>('/graph/edges', payload);
    return data;
};
