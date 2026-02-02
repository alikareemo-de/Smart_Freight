import { Box, CircularProgress, Typography } from '@mui/material';

type LoadingStateProps = {
    message?: string;
};

const LoadingState = ({ message = 'Loading data...' }: LoadingStateProps) => (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" py={6}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" mt={2}>
            {message}
        </Typography>
    </Box>
);

export default LoadingState;
