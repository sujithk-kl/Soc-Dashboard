// client/src/components/auth/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // If not authenticated, redirect to IAM login by default
        return <Navigate to="/login/iam" />;
    }

    // If authenticated, render the component that was passed in
    return children;
};

export default ProtectedRoute;