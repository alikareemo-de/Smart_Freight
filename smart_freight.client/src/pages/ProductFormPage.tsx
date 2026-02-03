import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, Paper, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { z } from 'zod';
import { useEffect } from 'react';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useCreateProduct, useProduct, useUpdateProduct } from '../hooks/products';
import type { ProductCreateRequest } from '../types/product';

const productSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    sku: z.string().optional().or(z.literal('')),
    unitWeightKg: z.coerce.number().positive('Unit weight must be greater than 0.'),
});

type ProductFormValues = z.infer<typeof productSchema>;

type ProductFormPageProps = {
    mode: 'create' | 'edit';
};

const ProductFormPage = ({ mode }: ProductFormPageProps) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = mode === 'edit';
    const { data, isLoading, isError, refetch } = useProduct(isEdit ? id ?? '' : '');
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct(id ?? '');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            sku: '',
            unitWeightKg: 0,
        },
    });

    useEffect(() => {
        if (data && isEdit) {
            setValue('name', data.name, { shouldDirty: false });
            setValue('sku', data.sku ?? '', { shouldDirty: false });
            setValue('unitWeightKg', data.unitWeightKg, { shouldDirty: false });
        }
    }, [data, isEdit, setValue]);

    if (isEdit && isLoading) {
        return <LoadingState message="Loading product..." />;
    }

    if (isEdit && (isError || !data)) {
        return <ErrorState message="Unable to load product." onRetry={refetch} />;
    }

    const onSubmit = async (values: ProductFormValues) => {
        const payload: ProductCreateRequest = {
            name: values.name,
            sku: values.sku || null,
            unitWeightKg: values.unitWeightKg,
        };

        try {
            if (isEdit && id) {
                await updateMutation.mutateAsync(payload);
                enqueueSnackbar('Product updated.', { variant: 'success' });
                navigate('/products');
            } else {
                await createMutation.mutateAsync(payload);
                enqueueSnackbar('Product created.', { variant: 'success' });
                navigate('/products');
            }
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'Unable to save product.';
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    return (
        <Box>
            <PageHeader
                title={isEdit ? 'Edit Product' : 'Create Product'}
                subtitle="Maintain product catalog and unit weights."
            />
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Product Name"
                                fullWidth
                                {...register('name')}
                                error={Boolean(errors.name)}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="SKU"
                                fullWidth
                                {...register('sku')}
                                error={Boolean(errors.sku)}
                                helperText={errors.sku?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Unit Weight (kg)"
                                fullWidth
                                type="number"
                                {...register('unitWeightKg')}
                                error={Boolean(errors.unitWeightKg)}
                                helperText={errors.unitWeightKg?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" gap={2}>
                                <Button type="submit" variant="contained" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </Button>
                                <Button variant="outlined" onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default ProductFormPage;
