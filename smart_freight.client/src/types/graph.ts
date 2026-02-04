export type GraphNode = {
    id: string;
    name: string;
    latitude?: number | null;
    longitude?: number | null;
};

export type GraphNodeCreateRequest = {
    name: string;
    latitude?: number | null;
    longitude?: number | null;
};

export type GraphEdge = {
    id: string;
    fromNodeId: string;
    toNodeId: string;
    weight: number;
    isBidirectional: boolean;
};

export type GraphEdgeCreateRequest = {
    fromNodeId: string;
    toNodeId: string;
    weight: number;
    isBidirectional: boolean;
};
