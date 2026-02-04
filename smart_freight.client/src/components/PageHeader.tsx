import { Box, Button, Typography } from '@mui/material';

type PageHeaderProps = {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onAction?: () => void;
};

const PageHeader = ({ title, subtitle, actionLabel, onAction }: PageHeaderProps) => (
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Box>
            <Typography variant="h4" fontWeight={600}>
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="body2" color="text.secondary">
                    {subtitle}
                </Typography>
            )}
        </Box>
        {actionLabel && onAction && (
            <Button variant="contained" onClick={onAction}>
                {actionLabel}
            </Button>
        )}
    </Box>
);

export default PageHeader;
