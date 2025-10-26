// src/pages/SignupPage.jsx
// ✅ VERSION FINALE avec navigation et Firebase

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✨ AJOUTER
import { useApp } from '@/context/AppContext'; // ✨ AJOUTER
import { Button, Input, Card } from '@/components/ui';

/**
 * Page d'inscription
 */
export const SignupPage = () => {  // ⚠️ ENLEVER les props
  const navigate = useNavigate(); // ✨ AJOUTER
  const { signup } = useApp(); // ✨ AJOUTER
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit faire au moins 8 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✨ MODIFIER cette fonction
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    
    try {
      // Appeler la fonction signup du Context
      await signup(formData.email, formData.password, formData.name);
      
      // Si succès, rediriger vers welcome
      navigate('/welcome');
      
    } catch (error) {
      // Afficher l'erreur
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        {/* Bouton retour - ✨ MODIFIER onClick */}
        <button
          onClick={() => navigate('/')}  // ✨ CHANGER
          className="text-gray-600 hover:text-gray-800 mb-4 flex items-center transition-colors"
        >
          ← Retour
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-2">Créer un compte</h2>
        <p className="text-gray-600 text-center mb-8">
          Commencez gratuitement dès aujourd'hui
        </p>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <Input
            label="Nom complet"
            type="text"
            placeholder="Jean Dupont"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="jean.dupont@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            required
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="Minimum 8 caractères"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            hint="Utilisez un mot de passe fort avec lettres, chiffres et symboles"
            required
          />

          <Input
            label="Confirmer le mot de passe"
            type="password"
            placeholder="Retapez votre mot de passe"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            required
          />

          {/* Erreur générale */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Bouton submit */}
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            className="w-full mt-2"
          >
            Créer mon compte
          </Button>
        </form>

        {/* Footer légal */}
        <div className="mt-6 text-center text-sm text-gray-600">
          En créant un compte, vous acceptez nos{' '}
          <a href="#" className="text-blue-600 hover:underline">
            CGU
          </a>{' '}
          et notre{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Politique de confidentialité
          </a>
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;
