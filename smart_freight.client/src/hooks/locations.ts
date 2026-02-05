import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLocation, deleteLocation, fetchLocation, fetchLocations, updateLocation } from '../api/locations';
import type { LocationCreateRequest, LocationUpdateRequest } from '../types/location';

export const useLocations = () =>
    useQuery({
        queryKey: ['locations'],
        queryFn: fetchLocations,
    });

export const useLocation = (id: string) =>
    useQuery({
        queryKey: ['locations', id],
        queryFn: () => fetchLocation(id),
        enabled: Boolean(id),
    });

export const useCreateLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: LocationCreateRequest) => createLocation(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
    });
};

export const useUpdateLocation = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: LocationUpdateRequest) => updateLocation(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            queryClient.invalidateQueries({ queryKey: ['locations', id] });
        },
    });
};

export const useDeleteLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteLocation(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
    });
};
