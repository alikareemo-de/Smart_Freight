export type Truck = {
    id: string;
    name: string;
    plateNumber: string;
    maxPayloadKg: number;
    isActive: boolean;
    createdAt: string;
};

export type TruckCreateRequest = {
    name: string;
    plateNumber: string;
    maxPayloadKg: number;
    isActive: boolean;
};

export type TruckUpdateRequest = TruckCreateRequest;
