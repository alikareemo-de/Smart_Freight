export type Driver = {
    id: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    phoneNumber?: string | null;
    licenseNumber?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string | null;
};

export type DriverCreateRequest = {
    firstName: string;
    lastName: string;
    email?: string | null;
    phoneNumber?: string | null;
    licenseNumber?: string | null;
    isActive: boolean;
};

export type DriverUpdateRequest = DriverCreateRequest;
