import { httpClient } from './http';
import type {
    Product,
    ProductCreateRequest,
    ProductStock,
    ProductUpdateRequest,
    StockAdjustRequest,
} from '../types/product';

export const fetchProducts = async () => {
    const { data } = await httpClient.get<Product[]>('/products');
    return data;
};

export const fetchProduct = async (id: string) => {
    const { data } = await httpClient.get<Product>(`/products/${id}`);
    return data;
};

export const createProduct = async (payload: ProductCreateRequest) => {
    const { data } = await httpClient.post<Product>('/products', payload);
    return data;
};

export const updateProduct = async (id: string, payload: ProductUpdateRequest) => {
    const { data } = await httpClient.put<Product>(`/products/${id}`, payload);
    return data;
};

export const deleteProduct = async (id: string) => {
    await httpClient.delete(`/products/${id}`);
};

export const fetchProductStock = async (id: string) => {
    const { data } = await httpClient.get<ProductStock>(`/products/${id}/stock`);
    return data;
};

export const adjustProductStock = async (id: string, payload: StockAdjustRequest) => {
    const { data } = await httpClient.post<ProductStock>(`/products/${id}/stock/adjust`, payload);
    return data;
};
