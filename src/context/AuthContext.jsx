// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';

/**
 * Contexte d'authentification
 * Gère l'état de l'utilisateur connecté dans toute l'application
 */
const AuthContext = createContext(null);

/**
 * Hook personnalisé pour accéder au contexte d'authentification
 * @returns {Object} Contexte d'authentification
 * @throws {Error} Si utilisé en dehors du AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

/**
 * Provider d'authentification
 * Enveloppe l'application et fournit l'état d'authentification
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Observer les changements d'état d'authentification
  useEffect(() => {
    console.log('🔄 Initialisation AuthContext...');
    
    const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        console.log('✅ Utilisateur connecté:', firebaseUser.email);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          createdAt: firebaseUser.metadata.creationTime,
          lastLoginAt: firebaseUser.metadata.lastSignInTime
        });
      } else {
        console.log('❌ Aucun utilisateur connecté');
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup: se désinscrire lors du démontage
    return () => unsubscribe();
  }, []);

  /**
   * Connexion avec email/password
   */
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      await authService.login(email, password);
      // L'état sera mis à jour automatiquement par onAuthStateChanged
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inscription avec email/password
   */
  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      setLoading(true);
      await authService.signup(email, password, displayName);
      // L'état sera mis à jour automatiquement par onAuthStateChanged
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Connexion avec Google
   */
  const loginWithGoogle = async () => {
    try {
      setError(null);
      await authService.loginWithGoogle();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Connexion avec Apple
   */
  const loginWithApple = async () => {
    try {
      setError(null);
      await authService.loginWithApple();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Déconnexion
   */
  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      // L'état sera mis à jour automatiquement par onAuthStateChanged
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Réinitialisation du mot de passe
   */
  const resetPassword = async (email) => {
    try {
      setError(null);
      await authService.resetPassword(email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Effacer les erreurs
   */
  const clearError = () => {
    setError(null);
  };

  // Valeurs exposées par le contexte
  const value = {
    // État
    user,
    loading,
    error,
    isAuthenticated: !!user,

    // Méthodes
    login,
    signup,
    loginWithGoogle,
    loginWithApple,
    logout,
    resetPassword,
    clearError
  };

  // Afficher un loader pendant le chargement initial
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
