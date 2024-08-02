// src/components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';

const AdminRoute = ({ children }) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user || !isAdmin) {
        
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default AdminRoute;