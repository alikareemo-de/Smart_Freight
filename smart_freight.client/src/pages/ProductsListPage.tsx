import { useMemo, useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Stack,
    TablePagination,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory2';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import DataTable from '../components/DataTable';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useDeleteProduct, useProducts } from '../hooks/products';
import type { Product } from '../types/product';

const ProductsListPage = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = useProducts();
    const deleteMutation = useDeleteProduct();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const filtered = useMemo(() => {
        if (!data) return [];
        const query = search.trim().toLowerCase();
        if (!query) return data;
        return data.filter((product) =>
            [product.name, product.sku ?? ''].join(' ').toLowerCase().includes(query)
        );
    }, [data, search]);

    const paginated = useMemo(() => {
        const start = page * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
    }, [filtered, page, rowsPerPage]);

    const handleDelete = async () => {
        if (!selectedProduct) return;
        try {
            await deleteMutation.mutateAsync(selectedProduct.id);
            enqueueSnackbar('Product deleted.', { variant: 'success' });
            setSelectedProduct(null);
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'Unable to delete product.';
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    if (isLoading) {
        return <LoadingState message="Loading products..." />;
    }

    if (isError) {
        return <ErrorState message="Unable to load products." onRetry={refetch} />;
    }

    return (
        <Box>
            <PageHeader
                title="Products"
                subtitle="Manage product catalog and available inventory."
                actionLabel="Add Product"
                onAction={() => navigate('/products/new')}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                <TextField
                    placeholder="Search products"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                />
                <Button variant="outlined" onClick={() => refetch()}>
                    Refresh
                </Button>
            </Stack>
            <DataTable
                rows={paginated}
                columns={[
                    {
                        header: 'Product',
                        render: (product: Product) => (
                            <Box>
                                <Typography fontWeight={600}>{product.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {product.sku ?? 'No SKU'}
                                </Typography>
                            </Box>
                        ),
                    },
                    {
                        header: 'Unit Weight',
                        render: (product: Product) => `${product.unitWeightKg} kg`,
                    },
                    {
                        header: 'Available',
                        render: (product: Product) => product.availableQuantity.toLocaleString(),
                    },
                    {
                        header: 'Actions',
                        render: (product: Product) => (
                            <Box display="flex" gap={1}>
                                <Tooltip title="Stock">
                                    <IconButton onClick={() => navigate(`/products/${product.id}/stock`)}>
                                        <InventoryIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit">
                                    <IconButton onClick={() => navigate(`/products/${product.id}/edit`)}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton color="error" onClick={() => setSelectedProduct(product)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        ),
                    },
                ]}
            />
            <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={(_, nextPage) => setPage(nextPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(Number(event.target.value));
                    setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 20]}
            />
            <ConfirmDialog
                open={Boolean(selectedProduct)}
                title="Delete product?"
                description="This action cannot be undone."
                confirmLabel="Delete"
                onConfirm={handleDelete}
                onCancel={() => setSelectedProduct(null)}
                isLoading={deleteMutation.isPending}
            />
        </Box>
    );
};

export default ProductsListPage;
