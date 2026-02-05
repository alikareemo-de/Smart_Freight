import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type RequireRoleProps = {
    allowedRoles: string[];
};

const RequireRole = ({ allowedRoles }: RequireRoleProps) => {
    const { auth } = useAuth();

    if (!auth?.role) {
        return <Navigate to="/not-authorized" replace />;
    }

    if (!allowedRoles.includes(auth.role)) {
        return <Navigate to="/not-authorized" replace />;
    }

    return <Outlet />;
};

export default RequireRole;
