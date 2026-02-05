import { httpClient } from './http';
import type { Location, LocationCreateRequest, LocationUpdateRequest } from '../types/location';

export const fetchLocations = async () => {
    const { data } = await httpClient.get<Location[]>('/locations');
    return data;
};

export const fetchLocation = async (id: string) => {
    const { data } = await httpClient.get<Location>(`/locations/${id}`);
    return data;
};

export const createLocation = async (payload: LocationCreateRequest) => {
    const { data } = await httpClient.post<Location>('/locations', payload);
    return data;
};

export const updateLocation = async (id: string, payload: LocationUpdateRequest) => {
    const { data } = await httpClient.put<Location>(`/locations/${id}`, payload);
    return data;
};

export const deleteLocation = async (id: string) => {
    await httpClient.delete(`/locations/${id}`);
};
