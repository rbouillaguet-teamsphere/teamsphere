// src/components/onboarding/steps/InvitesStep.jsx
import React, { useState } from 'react';
import { Button, Input } from '@/components/ui';

/**
 * Étape 4 : Invitations des membres
 * @param {object} props - Props du composant
 * @param {object} props.data - Données accumulées du wizard
 * @param {function} props.onNext - Callback pour terminer le wizard
 * @param {function} props.onBack - Callback pour revenir en arrière
 * @param {function} props.onSkip - Callback pour passer cette étape
 */
export const InvitesStep = ({ data, onNext, onBack, onSkip }) => {
  const [invites, setInvites] = useState(
    data?.invites?.length > 0 
      ? data.invites 
      : [{ email: '', role: 'coach' }]
  );
  const [errors, setErrors] = useState({});

  const roles = [
    { value: 'admin', label: '👑 Admin', description: 'Tous les droits' },
    { value: 'coach', label: '🏃 Coach', description: 'Gestion équipe' },
    { value: 'player', label: '👥 Joueur', description: 'Lecture seule' },
    { value: 'viewer', label: '👁️ Observateur', description: 'Consultation' },
  ];

  const addInvite = () => {
    setInvites([...invites, { email: '', role: 'coach' }]);
  };

  const removeInvite = (index) => {
    if (invites.length > 1) {
      setInvites(invites.filter((_, i) => i !== index));
      // Nettoyer les erreurs
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const updateInvite = (index, field, value) => {
    const newInvites = [...invites];
    newInvites[index][field] = value;
    setInvites(newInvites);
    
    // Nettoyer l'erreur du champ
    if (errors[index]) {
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleNext = () => {
    // Valider les emails non vides
    const newErrors = {};
    invites.forEach((invite, index) => {
      if (invite.email.trim() && !validateEmail(invite.email)) {
        newErrors[index] = 'Email invalide';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Filtrer les invitations valides
    const validInvites = invites.filter(inv => inv.email.trim());
    onNext({ invites: validInvites });
  };

  return (
    <div>
      {/* Header */}
      <h2 className="text-2xl font-bold mb-2">Invitez vos coachs et membres</h2>
      <p className="text-gray-600 mb-6">
        Ajoutez des membres à votre club <strong>{data?.club?.name}</strong> (optionnel)
      </p>

      {/* Liste des invitations */}
      <div className="space-y-3 mb-6">
        {invites.map((invite, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-2">
            {/* Email */}
            <div className="flex-1">
              <Input
                placeholder="email@example.com"
                type="email"
                value={invite.email}
                onChange={(e) => updateInvite(index, 'email', e.target.value)}
                error={errors[index]}
                className="mb-0"
              />
            </div>

            {/* Rôle */}
            <div className="flex gap-2">
              <select
                value={invite.role}
                onChange={(e) => updateInvite(index, 'role', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title={roles.find(r => r.value === invite.role)?.description}
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>

              {/* Bouton supprimer */}
              {invites.length > 1 && (
                <button
                  onClick={() => removeInvite(index)}
                  className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="Retirer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bouton ajouter */}
      <button
        onClick={addInvite}
        className="text-blue-600 hover:text-blue-700 font-medium mb-6 flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Ajouter une personne</span>
      </button>

      {/* Légende des rôles */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-sm mb-2">Description des rôles :</h4>
        <div className="space-y-1 text-sm text-gray-600">
          {roles.map(role => (
            <div key={role.value} className="flex items-center space-x-2">
              <span>{role.label}</span>
              <span>-</span>
              <span>{role.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-blue-700">
          💡 Les invitations seront envoyées par email avec un lien d'accès sécurisé
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          ← Retour
        </Button>
        <div className="space-x-2">
          <Button type="button" variant="secondary" onClick={onSkip}>
            Passer
          </Button>
          <Button type="button" onClick={handleNext}>
            Terminer 🎉
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvitesStep;