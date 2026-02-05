import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createDriver, deleteDriver, fetchDriver, fetchDrivers, updateDriver } from '../api/drivers';
import type { DriverCreateRequest, DriverUpdateRequest } from '../types/driver';

export const useDrivers = () =>
    useQuery({
        queryKey: ['drivers'],
        queryFn: fetchDrivers,
    });

export const useDriver = (id: string) =>
    useQuery({
        queryKey: ['drivers', id],
        queryFn: () => fetchDriver(id),
        enabled: Boolean(id),
    });

export const useCreateDriver = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: DriverCreateRequest) => createDriver(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['drivers'] }),
    });
};

export const useUpdateDriver = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: DriverUpdateRequest) => updateDriver(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drivers'] });
            queryClient.invalidateQueries({ queryKey: ['drivers', id] });
        },
    });
};

export const useDeleteDriver = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteDriver(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['drivers'] }),
    });
};
