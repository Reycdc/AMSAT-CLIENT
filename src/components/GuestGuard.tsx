import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import React from 'react';
import { getUserRolePath } from '../utils/roleUtils';

export default function GuestGuard({ children }: { children: React.ReactElement }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    const rolePath = getUserRolePath(user);
    return <Navigate to={`/${rolePath}`} replace />;
  }

  return children;
}
