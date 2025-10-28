// src/router/index.jsx
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

// Pages publiques
import LandingPage from '@/pages/LandingPage';
import SignupPage from '@/pages/SignupPage';
import WelcomeScreen from '@/pages/WelcomeScreen';

// Onboarding
import { OnboardingWizard } from '@/components/onboarding';

// Pages protégées (à créer ou importer depuis App.jsx)
import DashboardPage from '@/pages/DashboardPage';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PlayersPage from '@/pages/PlayersPage';
import CalendarPage from '@/pages/CalendarPage';
// import StatisticsPage from '@/pages/StatisticsPage';

/**
 * Composant pour protéger les routes authentifiées
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useApp();

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

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * Composant pour les routes publiques uniquement
 * Redirige vers le dashboard si déjà connecté
 */
const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/**
 * Configuration des routes de l'application
 */
export const router = createBrowserRouter([
  // Routes publiques
  {
    path: '/',
    element: (
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <SignupPage />
      </PublicRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        {/* TODO: Créer LoginPage */}
        <div>Login Page - À implémenter</div>
      </PublicRoute>
    ),
  },

  // Routes d'onboarding (authentifiées)
  {
    path: '/welcome',
    element: (
      <ProtectedRoute>
        <WelcomeScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <OnboardingWizard />
      </ProtectedRoute>
    ),
  },

  // Routes protégées (dashboard)
  {
  path: '/dashboard',
  element: (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
},
  {
  path: '/players',
  element: (
    <ProtectedRoute>
      <PlayersPage />
    </ProtectedRoute>
  ),
},
  {
  path: '/calendar',
  element: (
    <ProtectedRoute>
      <DashboardLayout>
        <CalendarPage />
      </DashboardLayout>
    </ProtectedRoute>
  )
},
  {
    path: '/statistics',
    element: (
      <ProtectedRoute>
        {/* TODO: Importer StatisticsPage depuis App.jsx */}
        <div>Statistics - À migrer depuis App.jsx</div>
      </ProtectedRoute>
    ),
  },

  // 404
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">Page non trouvée</p>
          <a href="/" className="text-blue-600 hover:underline">
            Retour à l'accueil
          </a>
        </div>
      </div>
    ),
  },
]);

export default router;