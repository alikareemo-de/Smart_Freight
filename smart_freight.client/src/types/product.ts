export type Product = {
    id: string;
    name: string;
    sku?: string | null;
    unitWeightKg: number;
    availableQuantity: number;
    createdAt: string;
};

export type ProductCreateRequest = {
    name: string;
    sku?: string | null;
    unitWeightKg: number;
};

export type ProductUpdateRequest = ProductCreateRequest;

export type ProductStock = {
    productId: string;
    availableQuantity: number;
    updatedAt: string;
};

export type StockAdjustRequest = {
    quantityChange: number;
    reason: string;
};
