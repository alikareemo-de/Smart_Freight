import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import PageHeader from '../components/PageHeader';
import { useDriver } from '../hooks/drivers';

const DriverDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = useDriver(id ?? '');

    if (isLoading) {
        return <LoadingState message="Loading driver details..." />;
    }

    if (isError || !data) {
        return <ErrorState message="Unable to load driver details." onRetry={refetch} />;
    }

    return (
        <Box>
            <PageHeader
                title={`${data.firstName} ${data.lastName}`}
                subtitle="Driver profile details."
                actionLabel="Edit Driver"
                onAction={() => navigate(`/drivers/${data.id}/edit`)}
            />
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Contact
                        </Typography>
                        <Typography fontWeight={600} mt={2}>
                            Email
                        </Typography>
                        <Typography>{data.email ?? 'Not provided'}</Typography>
                        <Typography fontWeight={600} mt={2}>
                            Phone
                        </Typography>
                        <Typography>{data.phoneNumber ?? 'Not provided'}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Licensing
                        </Typography>
                        <Typography fontWeight={600} mt={2}>
                            License Number
                        </Typography>
                        <Typography>{data.licenseNumber ?? 'Not provided'}</Typography>
                        <Typography fontWeight={600} mt={2}>
                            Status
                        </Typography>
                        <Typography>{data.isActive ? 'Active' : 'Inactive'}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Metadata
                        </Typography>
                        <Typography fontWeight={600} mt={2}>
                            Created At
                        </Typography>
                        <Typography>{new Date(data.createdAt).toLocaleString()}</Typography>
                        <Typography fontWeight={600} mt={2}>
                            Updated At
                        </Typography>
                        <Typography>{data.updatedAt ? new Date(data.updatedAt).toLocaleString() : '—'}</Typography>
                    </Paper>
                </Grid>
            </Grid>
            <Box mt={3}>
                <Button variant="outlined" onClick={() => navigate('/drivers')}>
                    Back to list
                </Button>
            </Box>
        </Box>
    );
};

export default DriverDetailsPage;
