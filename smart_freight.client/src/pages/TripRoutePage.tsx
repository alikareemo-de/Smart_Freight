import { Box, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import DataTable from '../components/DataTable';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useTripRoute } from '../hooks/trips';
import type { TripRouteStep } from '../types/trip';

const TripRoutePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = useTripRoute(id ?? '');

    if (isLoading) {
        return <LoadingState message="Loading route steps..." />;
    }

    if (isError || !data) {
        return <ErrorState message="Unable to load route steps." onRetry={refetch} />;
    }

    return (
        <Box>
            <PageHeader
                title="Trip Route"
                subtitle="Ordered path computed by Dijkstra."
                actionLabel="Back to Trip"
                onAction={() => navigate(`/trips/${id}`)}
            />
            <DataTable
                rows={data}
                columns={[
                    { header: 'Step', render: (step: TripRouteStep) => step.stepOrder },
                    { header: 'From Node', render: (step: TripRouteStep) => step.fromNodeId },
                    { header: 'To Node', render: (step: TripRouteStep) => step.toNodeId },
                    { header: 'Edge Weight', render: (step: TripRouteStep) => step.edgeWeight },
                    { header: 'Cumulative', render: (step: TripRouteStep) => step.cumulativeWeight },
                ]}
            />
            <Box mt={3}>
                <Button variant="outlined" onClick={() => navigate('/trips')}>
                    Back to trips
                </Button>
            </Box>
        </Box>
    );
};

export default TripRoutePage;
