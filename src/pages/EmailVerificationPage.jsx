// src/pages/EmailVerificationPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import authService from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

/**
 * Page de vérification d'email
 * Affichée après l'inscription pour demander à l'utilisateur de vérifier son email
 * Bloque l'accès au dashboard tant que l'email n'est pas vérifié
 */
export const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useApp();
  
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState('');

  // Rediriger vers login si non connecté
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, navigate]);

  /**
   * Vérifier périodiquement si l'email est vérifié
   */
  useEffect(() => {
    const checkVerification = async () => {
      if (!currentUser) return;

      // Recharger les données utilisateur depuis Firebase
      await authService.reloadUser();
      
      // Vérifier si l'email est vérifié
      if (authService.isEmailVerified()) {
        setIsVerified(true);
        
        // Rediriger vers welcome/onboarding après 2 secondes
        setTimeout(() => {
          navigate('/welcome');
        }, 2000);
      }
    };

    // Vérifier toutes les 3 secondes
    const interval = setInterval(checkVerification, 3000);

    // Vérification initiale
    checkVerification();

    // Nettoyer l'interval au démontage
    return () => clearInterval(interval);
  }, [currentUser, navigate]);

  /**
   * Renvoyer l'email de vérification
   */
  const handleResendEmail = async () => {
    setResendLoading(true);
    setError('');
    setResendSuccess(false);

    try {
      await authService.sendVerificationEmail();
      setResendSuccess(true);
      
      // Masquer le message de succès après 5 secondes
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      console.error('Erreur renvoi email:', err);
      setError(err.message || 'Impossible d\'envoyer l\'email. Réessayez plus tard.');
    } finally {
      setResendLoading(false);
    }
  };

  /**
   * Se déconnecter et retourner au login
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Erreur déconnexion:', err);
    }
  };

  // Si email déjà vérifié, afficher message de succès
  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 shadow-lg">
          {/* Icône de succès */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Email vérifié !
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Votre adresse email a été vérifiée avec succès. Vous allez être redirigé vers la configuration de votre compte...
          </p>

          {/* Animation de chargement */}
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </Card>
      </div>
    );
  }

  // Page principale de vérification
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 shadow-lg">
        {/* Icône email */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Vérifiez votre email
          </h2>
          <p className="text-gray-600">
            Nous avons envoyé un email de vérification à :
          </p>
          <p className="font-semibold text-gray-900 mt-2">
            {currentUser?.email}
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Pour continuer :
          </h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Ouvrez votre boîte email</li>
            <li>Cliquez sur le lien de vérification</li>
            <li>Revenez sur cette page</li>
          </ol>
        </div>

        {/* Message de succès renvoi */}
        {resendSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-800 text-sm font-medium">
                Email de vérification renvoyé avec succès !
              </p>
            </div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 text-sm font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Bouton renvoyer email */}
        <Button
          onClick={handleResendEmail}
          disabled={resendLoading}
          className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi en cours...
            </span>
          ) : (
            'Renvoyer l\'email de vérification'
          )}
        </Button>

        {/* Informations complémentaires */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Vous ne voyez pas l'email ?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Vérifiez votre dossier spam</li>
                <li>L'email peut prendre quelques minutes</li>
                <li>Utilisez le bouton ci-dessus pour le renvoyer</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Indicateur de vérification automatique */}
        <div className="flex items-center justify-center text-sm text-gray-500 mb-6">
          <div className="animate-pulse mr-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
          <span>Vérification automatique en cours...</span>
        </div>

        {/* Bouton se déconnecter */}
        <button
          onClick={handleLogout}
          className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
        >
          Se déconnecter
        </button>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            Besoin d'aide ? Contactez-nous à{' '}
            <a href="mailto:support@teamsphere.com" className="text-blue-600 hover:underline">
              support@teamsphere.com
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default EmailVerificationPage;