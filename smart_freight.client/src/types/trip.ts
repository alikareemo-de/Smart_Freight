export type TripLifecycleStatus = 'Waiting' | 'Active' | 'Cancelled' | 'Done';

export type TripSummary = {
    id: string;
    truckId: string;
    truckName: string;
    driverId: string;
    driverName: string;
    status: TripLifecycleStatus;
    totalPlannedDistance: number;
    createdAt: string;
    doneAt?: string | null;
};

export type TripCargoItemRequest = {
    productId: string;
    quantity: number;
};

export type TripPlanRequest = {
    truckId: string;
    driverId: string;
    startNodeId: string;
    cargoItems: TripCargoItemRequest[];
    stopLocationIds: string[];
    status?: Exclude<TripLifecycleStatus, 'Done'>;
};

export type TripStop = {
    id: string;
    stopLocationId: string;
    stopName: string;
    stopOrder: number;
    status: string;
};

export type TripRouteStep = {
    stepOrder: number;
    fromNodeId: string;
    toNodeId: string;
    edgeWeight: number;
    cumulativeWeight: number;
};

export type TripPlanResponse = {
    tripId: string;
    totalWeightKg: number;
    totalPlannedDistance: number;
    stops: TripStop[];
    routeSteps: TripRouteStep[];
};

export type TripCargo = {
    productId: string;
    productName: string;
    quantity: number;
    totalWeightKg: number;
};

export type TripDetails = {
    id: string;
    truckId: string;
    truckName: string;
    driverId: string;
    driverName: string;
    status: TripLifecycleStatus;
    totalPlannedDistance: number;
    createdAt: string;
    doneAt?: string | null;
    stops: TripStop[];
    cargoItems: TripCargo[];
};

export type TripStatusUpdateRequest = {
    status: Exclude<TripLifecycleStatus, 'Done'>;
};

export type TripStopStatusUpdateRequest = {
    status: string;
    notes?: string | null;
};
