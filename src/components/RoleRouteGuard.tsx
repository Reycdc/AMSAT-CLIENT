import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserRolePath, ALIAS_ROLES } from '../utils/roleUtils';
import React from 'react';

export default function RoleRouteGuard({ children }: { children: React.ReactElement }) {
    const { role } = useParams<{ role: string }>();
    const { user, isLoading } = useAuth();

    // If loading auth, wait
    if (isLoading) return <div>Loading...</div>;

    // If not authenticated, let ProtectedRoute handle it (or redirect to login)
    if (!user) return <Navigate to="/login" replace />;

    const correctRole = getUserRolePath(user);

    // If URL role is invalid or doesn't match user's role
    // We allow "admin" to access "admin" path.
    // If user is "author" but tries "/admin", redirect to "/author".
    if (!role || !ALIAS_ROLES.includes(role) || role !== correctRole) {
        return <Navigate to={`/${correctRole}`} replace />;
    }

    return children;
}
