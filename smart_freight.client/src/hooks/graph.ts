import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createGraphEdge, createGraphNode, fetchGraphEdges, fetchGraphNodes } from '../api/graph';
import type { GraphEdgeCreateRequest, GraphNodeCreateRequest } from '../types/graph';

export const useGraphNodes = () =>
    useQuery({
        queryKey: ['graph', 'nodes'],
        queryFn: fetchGraphNodes,
    });

export const useCreateGraphNode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: GraphNodeCreateRequest) => createGraphNode(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['graph', 'nodes'] }),
    });
};

export const useGraphEdges = () =>
    useQuery({
        queryKey: ['graph', 'edges'],
        queryFn: fetchGraphEdges,
    });

export const useCreateGraphEdge = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: GraphEdgeCreateRequest) => createGraphEdge(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['graph', 'edges'] }),
    });
};
