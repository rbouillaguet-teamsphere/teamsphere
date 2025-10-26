// src/components/onboarding/SuccessScreen.jsx
import React from 'react';
import { Button } from '@/components/ui';

/**
 * Écran de félicitations après l'onboarding
 * @param {object} props - Props du composant
 * @param {object} props.data - Données complètes de l'onboarding
 * @param {function} props.onComplete - Callback pour aller au dashboard
 */
export const SuccessScreen = ({ data, onComplete }) => {
  const playerCount = data.players?.length || 0;
  const inviteCount = data.invites?.length || 0;

  const nextSteps = [
    { icon: '📅', text: 'Ajouter un match au calendrier' },
    { icon: '👥', text: 'Compléter les profils des joueurs' },
    { icon: '✉️', text: 'Inviter d\'autres membres' },
    { icon: '⚙️', text: 'Personnaliser votre club' },
  ];

  return (
    <div className="text-center">
      {/* Animation de confetti (emoji) */}
      <div className="text-6xl mb-6 animate-bounce">🎉</div>

      {/* Titre */}
      <h2 className="text-3xl font-bold mb-4">Bravo !</h2>
      
      {/* Sous-titre */}
      <p className="text-xl text-gray-600 mb-8">
        Votre club <strong className="text-blue-600">{data.club?.name}</strong> est prêt !
      </p>

      {/* Récapitulatif */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-green-900 mb-4 flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Récapitulatif :
        </h3>
        <div className="space-y-3 text-left max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">✓</span>
            <span className="text-gray-700">1 club créé</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">✓</span>
            <span className="text-gray-700">
              1 équipe <span className="text-gray-500">({data.team?.name})</span>
            </span>
          </div>
          {playerCount > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✓</span>
              <span className="text-gray-700">
                {playerCount} joueur{playerCount > 1 ? 's' : ''} ajouté{playerCount > 1 ? 's' : ''}
              </span>
            </div>
          )}
          {inviteCount > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✓</span>
              <span className="text-gray-700">
                {inviteCount} invitation{inviteCount > 1 ? 's' : ''} envoyée{inviteCount > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Prochaines étapes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          Prochaines étapes suggérées :
        </h3>
        <ul className="space-y-2">
          {nextSteps.map((step, idx) => (
            <li key={idx} className="flex items-center space-x-2 text-sm text-blue-800">
              <span>{step.icon}</span>
              <span>{step.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA principal */}
      <Button onClick={onComplete} size="lg" className="w-full">
        Découvrir mon dashboard 🚀
      </Button>

      {/* Message de motivation */}
      <p className="mt-6 text-sm text-gray-500">
        Vous pouvez modifier ces informations à tout moment depuis les paramètres
      </p>
    </div>
  );
};

export default SuccessScreen;