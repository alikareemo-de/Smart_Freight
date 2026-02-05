import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    fetchMyTrips,
    fetchTrip,
    fetchTripRoute,
    fetchTrips,
    fetchTripsByDriver,
    planAndCreateTrip,
    updateTripStatus,
    updateTripStopStatus,
} from '../api/trips';
import type { TripPlanRequest, TripStatusUpdateRequest, TripStopStatusUpdateRequest } from '../types/trip';

export const useTrips = () =>
    useQuery({
        queryKey: ['trips'],
        queryFn: fetchTrips,
    });

export const useTripsByDriver = (driverId: string) =>
    useQuery({
        queryKey: ['trips', 'driver', driverId],
        queryFn: () => fetchTripsByDriver(driverId),
        enabled: Boolean(driverId),
    });

export const useMyTrips = () =>
    useQuery({
        queryKey: ['trips', 'me'],
        queryFn: fetchMyTrips,
    });

export const useTrip = (id: string) =>
    useQuery({
        queryKey: ['trips', id],
        queryFn: () => fetchTrip(id),
        enabled: Boolean(id),
    });

export const useTripRoute = (id: string) =>
    useQuery({
        queryKey: ['trips', id, 'route'],
        queryFn: () => fetchTripRoute(id),
        enabled: Boolean(id),
    });

export const usePlanTrip = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: TripPlanRequest) => planAndCreateTrip(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips'] }),
    });
};

export const useUpdateTripStatus = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: TripStatusUpdateRequest) => updateTripStatus(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips', id] }),
    });
};

export const useUpdateTripStopStatus = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: { stopId: string; payload: TripStopStatusUpdateRequest }) =>
            updateTripStopStatus(id, params.stopId, params.payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips', id] }),
    });
};
