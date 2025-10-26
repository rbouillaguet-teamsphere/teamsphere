// src/pages/WelcomeScreen.jsx
// ✅ VERSION FINALE avec navigation et données utilisateur

import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✨ AJOUTER
import { useApp } from '@/context/AppContext'; // ✨ AJOUTER
import { Button, Card } from '@/components/ui';

/**
 * Écran de bienvenue après inscription
 */
export const WelcomeScreen = () => {  // ⚠️ ENLEVER les props
  const navigate = useNavigate(); // ✨ AJOUTER
  const { userProfile } = useApp(); // ✨ AJOUTER pour récupérer le nom
  
  const steps = [
    { number: 1, text: 'Créer votre club' },
    { number: 2, text: 'Ajouter votre première équipe' },
    { number: 3, text: 'Ajouter quelques joueurs' },
    { number: 4, text: 'Inviter vos coachs' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full text-center">
        {/* Emoji de bienvenue */}
        <div className="text-6xl mb-6 animate-bounce">👋</div>

        {/* Titre personnalisé - ✨ MODIFIER */}
        <h2 className="text-3xl font-bold mb-4">
          Bienvenue {userProfile?.name || 'sur TeamSphere'} !
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-6">
          Nous allons configurer votre espace en quelques étapes simples.
        </p>
        
        {/* Temps estimé */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-center space-x-2 text-blue-700">
            <span className="text-2xl">⏱️</span>
            <span className="font-medium">Temps estimé : 3 minutes</span>
          </div>
        </div>

        {/* Liste des étapes */}
        <div className="space-y-3 text-left mb-8">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold flex-shrink-0">
                {step.number}
              </div>
              <span className="text-gray-700">{step.text}</span>
            </div>
          ))}
        </div>

        {/* CTA - ✨ MODIFIER onClick */}
        <Button 
          onClick={() => navigate('/onboarding')}  // ✨ CHANGER
          size="lg" 
          className="w-full"
        >
          C'est parti ! 🚀
        </Button>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
