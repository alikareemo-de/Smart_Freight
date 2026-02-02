import { httpClient } from './http';
import type { Driver, DriverCreateRequest, DriverUpdateRequest } from '../types/driver';

export const fetchDrivers = async () => {
    const { data } = await httpClient.get<Driver[]>('/drivers');
    const { data } = await httpClient.get<Driver[]>('https://localhost:7276/drivers');
    return data;
};

export const fetchDriver = async (id: string) => {
    const { data } = await httpClient.get<Driver>(`/drivers/${id}`);
    const { data } = await httpClient.get<Driver>(`https://localhost:7276/drivers/${id}`);
    return data;
};

export const createDriver = async (payload: DriverCreateRequest) => {
    const { data } = await httpClient.post<Driver>('/drivers', payload);
    const { data } = await httpClient.post<Driver>('https://localhost:7276/drivers', payload);
    return data;
};

export const updateDriver = async (id: string, payload: DriverUpdateRequest) => {
    const { data } = await httpClient.put<Driver>(`/drivers/${id}`, payload);
    const { data } = await httpClient.put<Driver>(`https://localhost:7276/drivers/${id}`, payload);
    return data;
};

export const deleteDriver = async (id: string) => {
    await httpClient.delete(`/drivers/${id}`);
    await httpClient.delete(`https://localhost:7276/drivers/${id}`);
};
