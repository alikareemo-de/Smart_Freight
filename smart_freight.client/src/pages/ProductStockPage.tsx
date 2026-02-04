import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { z } from 'zod';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useAdjustProductStock, useProduct, useProductStock } from '../hooks/products';

const stockSchema = z.object({
    quantityChange: z.coerce.number().int(),
    reason: z.string().min(1, 'Reason is required.'),
});

type StockFormValues = z.infer<typeof stockSchema>;

const ProductStockPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: product, isLoading: productLoading, isError: productError, refetch: refetchProduct } = useProduct(
        id ?? ''
    );
    const {
        data: stock,
        isLoading: stockLoading,
        isError: stockError,
        refetch: refetchStock,
    } = useProductStock(id ?? '');
    const adjustMutation = useAdjustProductStock(id ?? '');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<StockFormValues>({
        resolver: zodResolver(stockSchema),
        defaultValues: {
            quantityChange: 0,
            reason: 'ManualAdjustment',
        },
    });

    if (productLoading || stockLoading) {
        return <LoadingState message="Loading stock..." />;
    }

    if (productError || stockError || !product || !stock) {
        return <ErrorState message="Unable to load product stock." onRetry={() => {
            refetchProduct();
            refetchStock();
        }} />;
    }

    const onSubmit = async (values: StockFormValues) => {
        const projected = stock.availableQuantity + values.quantityChange;
        if (projected < 0) {
            enqueueSnackbar('Stock cannot be negative.', { variant: 'error' });
            return;
        }
        try {
            await adjustMutation.mutateAsync({
                quantityChange: values.quantityChange,
                reason: values.reason,
            });
            enqueueSnackbar('Stock adjusted.', { variant: 'success' });
            reset({ quantityChange: 0, reason: values.reason });
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'Unable to adjust stock.';
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    return (
        <Box>
            <PageHeader
                title={`Stock: ${product.name}`}
                subtitle="View and adjust available inventory."
            />
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Current Available Quantity
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                        {stock.availableQuantity.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Last updated: {new Date(stock.updatedAt).toLocaleString()}
                    </Typography>
                </Stack>
            </Paper>
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Adjust Stock
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                    Enter positive numbers to add stock, negative to reduce. Stock cannot go below zero.
                </Alert>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2} maxWidth={420}>
                        <TextField
                            label="Quantity Change"
                            type="number"
                            {...register('quantityChange')}
                            error={Boolean(errors.quantityChange)}
                            helperText={errors.quantityChange?.message}
                        />
                        <TextField
                            label="Reason"
                            {...register('reason')}
                            error={Boolean(errors.reason)}
                            helperText={errors.reason?.message}
                        />
                        <Stack direction="row" spacing={2}>
                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Apply'}
                            </Button>
                            <Button variant="outlined" onClick={() => navigate('/products')}>
                                Back to products
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
};

export default ProductStockPage;
