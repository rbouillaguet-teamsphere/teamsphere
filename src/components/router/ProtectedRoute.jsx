// src/components/router/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Composant de route protégée
 * Redirige vers /login si l'utilisateur n'est pas authentifié
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Composant à protéger
 * @param {string} props.redirectTo - URL de redirection (défaut: /login)
 * 
 * @example
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */
export const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification...</p>
        </div>
      </div>
    );
  }

  // Si non authentifié, rediriger vers la page de login
  // en conservant la page demandée dans l'état
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Si authentifié, afficher le composant protégé
  return children;
};

/**
 * Composant de route publique
 * Redirige vers /dashboard si l'utilisateur est déjà authentifié
 * Utile pour les pages login/signup
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Composant à afficher
 * @param {string} props.redirectTo - URL de redirection (défaut: /dashboard)
 * 
 * @example
 * <PublicRoute>
 *   <LoginPage />
 * </PublicRoute>
 */
export const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si authentifié, rediriger vers la page demandée
  // ou vers le dashboard par défaut
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  // Si non authentifié, afficher le composant public
  return children;
};

export default ProtectedRoute;
