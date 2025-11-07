import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Mientras se carga el usuario, evitar parpadeos
    return null;
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/usuario/menu" replace />;
  }

  return children;
}