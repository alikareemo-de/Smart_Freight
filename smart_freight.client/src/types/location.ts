export type Location = {
    id: string;
    name: string;
    addressText?: string | null;
    graphNodeId: string;
    latitude?: number | null;
    longitude?: number | null;
    createdAt: string;
};

export type LocationCreateRequest = {
    name: string;
    addressText?: string | null;
    graphNodeId: string;
    latitude?: number | null;
    longitude?: number | null;
};

export type LocationUpdateRequest = LocationCreateRequest;
