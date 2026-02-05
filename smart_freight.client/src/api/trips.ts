import { httpClient } from './http';
import type {
    TripDetails,
    TripPlanRequest,
    TripPlanResponse,
    TripRouteStep,
    TripStatusUpdateRequest,
    TripStopStatusUpdateRequest,
    TripSummary,
} from '../types/trip';

export const planAndCreateTrip = async (payload: TripPlanRequest) => {
    const { data } = await httpClient.post<TripPlanResponse>('/trips/plan-and-create', payload);
    return data;
};

export const fetchTrips = async () => {
    const { data } = await httpClient.get<TripSummary[]>('/trips');
    return data;
};

export const fetchTripsByDriver = async (driverId: string) => {
    const { data } = await httpClient.get<TripSummary[]>(`/drivers/${driverId}/trips`);
    return data;
};

export const fetchMyTrips = async () => {
    const { data } = await httpClient.get<TripSummary[]>('/trips/me');
    return data;
};

export const fetchTrip = async (id: string) => {
    const { data } = await httpClient.get<TripDetails>(`/trips/${id}`);
    return data;
};

export const fetchTripRoute = async (id: string) => {
    const { data } = await httpClient.get<TripRouteStep[]>(`/trips/${id}/route`);
    return data;
};

export const updateTripStatus = async (id: string, payload: TripStatusUpdateRequest) => {
    await httpClient.patch(`/trips/${id}/status`, payload);
};

export const updateTripStopStatus = async (
    id: string,
    stopId: string,
    payload: TripStopStatusUpdateRequest
) => {
    await httpClient.patch(`/trips/${id}/stops/${stopId}/status`, payload);
};
