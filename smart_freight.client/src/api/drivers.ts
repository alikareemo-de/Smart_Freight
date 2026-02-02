import { httpClient } from './http';
import type { Driver, DriverCreateRequest, DriverUpdateRequest } from '../types/driver';

export const fetchDrivers = async () => {
    const { data } = await httpClient.get<Driver[]>('/drivers');
    return data;
};

export const fetchDriver = async (id: string) => {
    const { data } = await httpClient.get<Driver>(`/drivers/${id}`);
    return data;
};

export const createDriver = async (payload: DriverCreateRequest) => {
    const { data } = await httpClient.post<Driver>('/drivers', payload);
    return data;
};

export const updateDriver = async (id: string, payload: DriverUpdateRequest) => {
    const { data } = await httpClient.put<Driver>(`/drivers/${id}`, payload);
    return data;
};

export const deleteDriver = async (id: string) => {
    await httpClient.delete(`/drivers/${id}`);
};
