import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTruck, deleteTruck, fetchTruck, fetchTrucks, updateTruck } from '../api/trucks';
import type { TruckCreateRequest, TruckUpdateRequest } from '../types/truck';

export const useTrucks = () =>
    useQuery({
        queryKey: ['trucks'],
        queryFn: fetchTrucks,
    });

export const useTruck = (id: string) =>
    useQuery({
        queryKey: ['trucks', id],
        queryFn: () => fetchTruck(id),
        enabled: Boolean(id),
    });

export const useCreateTruck = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: TruckCreateRequest) => createTruck(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trucks'] }),
    });
};

export const useUpdateTruck = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: TruckUpdateRequest) => updateTruck(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trucks'] });
            queryClient.invalidateQueries({ queryKey: ['trucks', id] });
        },
    });
};

export const useDeleteTruck = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteTruck(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trucks'] }),
    });
};
