import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useTruck } from '../hooks/trucks';

const TruckDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = useTruck(id ?? '');

    if (isLoading) {
        return <LoadingState message="Loading truck details..." />;
    }

    if (isError || !data) {
        return <ErrorState message="Unable to load truck." onRetry={refetch} />;
    }

    return (
        <Box>
            <PageHeader
                title={data.name}
                subtitle="Truck profile details."
                actionLabel="Edit Truck"
                onAction={() => navigate(`/trucks/${data.id}/edit`)}
            />
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Fleet
                        </Typography>
                        <Typography fontWeight={600} mt={2}>
                            Plate Number
                        </Typography>
                        <Typography>{data.plateNumber}</Typography>
                        <Typography fontWeight={600} mt={2}>
                            Max Payload
                        </Typography>
                        <Typography>{data.maxPayloadKg.toLocaleString()} kg</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Status
                        </Typography>
                        <Typography fontWeight={600} mt={2}>
                            Active
                        </Typography>
                        <Typography>{data.isActive ? 'Active' : 'Inactive'}</Typography>
                        <Typography fontWeight={600} mt={2}>
                            Created At
                        </Typography>
                        <Typography>{new Date(data.createdAt).toLocaleString()}</Typography>
                    </Paper>
                </Grid>
            </Grid>
            <Box mt={3}>
                <Button variant="outlined" onClick={() => navigate('/trucks')}>
                    Back to list
                </Button>
            </Box>
        </Box>
    );
};

export default TruckDetailsPage;
