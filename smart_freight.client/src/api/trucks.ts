import { httpClient } from './http';
import type { Truck, TruckCreateRequest, TruckUpdateRequest } from '../types/truck';

export const fetchTrucks = async () => {
    const { data } = await httpClient.get<Truck[]>('/trucks');
    return data;
};

export const fetchTruck = async (id: string) => {
    const { data } = await httpClient.get<Truck>(`/trucks/${id}`);
    return data;
};

export const createTruck = async (payload: TruckCreateRequest) => {
    const { data } = await httpClient.post<Truck>('/trucks', payload);
    return data;
};

export const updateTruck = async (id: string, payload: TruckUpdateRequest) => {
    const { data } = await httpClient.put<Truck>(`/trucks/${id}`, payload);
    return data;
};

export const deleteTruck = async (id: string) => {
    await httpClient.delete(`/trucks/${id}`);
};
