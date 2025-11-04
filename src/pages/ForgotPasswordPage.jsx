// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

/**
 * Page de réinitialisation de mot de passe
 * Permet à l'utilisateur de demander un email de reset
 */
export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  /**
   * Validation de l'email
   * @returns {boolean} true si valide, false sinon
   */
  const validateEmail = () => {
    if (!email.trim()) {
      setError("L'email est requis");
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Adresse email invalide');
      return false;
    }
    
    return true;
  };

  /**
   * Gestion de la soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!validateEmail()) return;

    setLoading(true);
    setError('');
    
    try {
      // Appel au service de reset password
      await authService.resetPassword(email);
      
      // Affichage du message de succès
      setEmailSent(true);
      
    } catch (err) {
      console.error('Erreur reset password:', err);
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gestion du changement de l'email
   */
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Effacer l'erreur lors de la saisie
    if (error) setError('');
  };

  // Affichage du message de confirmation après envoi
  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 shadow-lg">
          {/* Icône de succès */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Message de succès */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Email envoyé !
          </h2>
          
          <div className="space-y-4 text-gray-600 text-center mb-6">
            <p>
              Un email de réinitialisation a été envoyé à :
            </p>
            <p className="font-semibold text-gray-900">
              {email}
            </p>
            <p className="text-sm">
              Cliquez sur le lien dans l'email pour créer un nouveau mot de passe.
            </p>
          </div>

          {/* Informations complémentaires */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Vous ne voyez pas l'email ?</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Vérifiez votre dossier spam</li>
                  <li>L'email peut prendre quelques minutes</li>
                  <li>Vérifiez que l'adresse est correcte</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Retour à la connexion
            </Button>
            
            <button
              onClick={() => setEmailSent(false)}
              className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors"
            >
              Renvoyer l'email
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Formulaire de demande de reset
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 shadow-lg">
        {/* Bouton retour */}
        <button
          onClick={() => navigate('/login')}
          className="text-gray-600 hover:text-gray-800 mb-6 flex items-center transition-colors group"
        >
          <svg 
            className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à la connexion
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Mot de passe oublié ?
          </h2>
          <p className="text-gray-600">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <Input
            label="Adresse email"
            type="email"
            placeholder="jean.dupont@example.com"
            value={email}
            onChange={handleEmailChange}
            error={error}
            required
            autoComplete="email"
            autoFocus
          />

          {/* Message d'information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-600">
                Nous vous enverrons un email avec un lien sécurisé pour réinitialiser votre mot de passe.
              </p>
            </div>
          </div>

          {/* Bouton submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </span>
            ) : (
              'Envoyer le lien de réinitialisation'
            )}
          </Button>
        </form>

        {/* Footer - Liens utiles */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600 text-sm">
            Vous vous souvenez de votre mot de passe ?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Se connecter
            </button>
          </p>
          <p className="text-gray-600 text-sm">
            Pas encore de compte ?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              S'inscrire
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
