import { useMemo, useState } from 'react';
import {
    AppBar,
    Avatar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory2';
import RouteIcon from '@mui/icons-material/AltRoute';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const AppLayout = () => {
    const theme = useTheme();
    const location = useLocation();
    const { auth, logout } = useAuth();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = useMemo(
        () => [
            { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
            { label: 'Drivers', icon: <LocalShippingIcon />, path: '/drivers' },
        ],
        []
    );

    const drawerContent = (
        <Box display="flex" flexDirection="column" height="100%">
            <Box px={2} py={3}>
                <Typography variant="h6" fontWeight={700}>
                    Smart Freight
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Dispatch Console
                </Typography>
            </Box>
            <Divider />
            <List>
                {navItems.map((item) => {
                    const selected = location.pathname.startsWith(item.path);
                    return (
                        <ListItemButton
                            key={item.path}
                            component={RouterLink}
                            to={item.path}
                            selected={selected}
                            onClick={() => isMobile && setMobileOpen(false)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    );
                })}
            </List>
            <Box mt="auto" p={2}>
                <ListItemButton onClick={logout}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sign out" />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box display="flex">
            <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    {isMobile && (
                        <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Smart Freight
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                            {auth?.email?.charAt(0).toUpperCase() ?? 'U'}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                {auth?.email ?? 'User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {auth?.role ?? 'Unknown'}
                            </Typography>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                {isMobile ? (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={() => setMobileOpen(false)}
                        ModalProps={{ keepMounted: true }}
                        sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }}
                    >
                        {drawerContent}
                    </Drawer>
                ) : (
                    <Drawer
                        variant="permanent"
                        sx={{ '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}
                        open
                    >
                        {drawerContent}
                    </Drawer>
                )}
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, mt: 8 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default AppLayout;
