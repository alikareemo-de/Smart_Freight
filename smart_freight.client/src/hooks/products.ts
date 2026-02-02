import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    adjustProductStock,
    createProduct,
    deleteProduct,
    fetchProduct,
    fetchProducts,
    fetchProductStock,
    updateProduct,
} from '../api/products';
import type { ProductCreateRequest, ProductUpdateRequest, StockAdjustRequest } from '../types/product';

export const useProducts = () =>
    useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });

export const useProduct = (id: string) =>
    useQuery({
        queryKey: ['products', id],
        queryFn: () => fetchProduct(id),
        enabled: Boolean(id),
    });

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: ProductCreateRequest) => createProduct(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    });
};

export const useUpdateProduct = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: ProductUpdateRequest) => updateProduct(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['products', id] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteProduct(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    });
};

export const useProductStock = (id: string) =>
    useQuery({
        queryKey: ['products', id, 'stock'],
        queryFn: () => fetchProductStock(id),
        enabled: Boolean(id),
    });

export const useAdjustProductStock = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: StockAdjustRequest) => adjustProductStock(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products', id, 'stock'] });
            queryClient.invalidateQueries({ queryKey: ['products', id] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};
