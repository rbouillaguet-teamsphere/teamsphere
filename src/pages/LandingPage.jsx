// src/pages/LandingPage.jsx
// ✅ VERSION FINALE avec navigation connectée

import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✨ AJOUTER cet import
import { Button, Card } from '@/components/ui';

/**
 * Page d'accueil publique de TeamSphere
 */
export const LandingPage = () => {  // ⚠️ ENLEVER les props (onSignup, onLogin)
  const navigate = useNavigate(); // ✨ AJOUTER cette ligne
  
  const features = [
    {
      icon: '📅',
      title: 'Calendrier & Matchs',
      description: 'Planifiez et suivez tous vos matchs'
    },
    {
      icon: '👥',
      title: 'Gestion des Joueurs',
      description: 'Profils, stats et présences'
    },
    {
      icon: '📊',
      title: 'Statistiques',
      description: 'Analyses en temps réel'
    },
    {
      icon: '🏢',
      title: 'Multi-Clubs',
      description: 'Gérez plusieurs clubs'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center text-white mb-12">
          <h1 className="text-6xl font-bold mb-4">🏉 TeamSphere</h1>
          <p className="text-2xl mb-2">Gérez votre club sportif simplement</p>
          <p className="text-xl opacity-90">
            La solution tout-en-un pour entraîneurs et clubs
          </p>
        </div>

        {/* Main Card */}
        <Card className="max-w-2xl mx-auto">
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className="text-2xl">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs - ✨ MODIFIER ces lignes */}
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/signup')}  // ✨ CHANGER onClick
              size="lg" 
              className="w-full"
            >
              Créer mon club gratuitement
            </Button>
            <Button 
              onClick={() => navigate('/login')}  // ✨ CHANGER onClick
              variant="ghost" 
              className="w-full"
            >
              J'ai déjà un compte
            </Button>
          </div>

          {/* Social Proof */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Utilisé par plus de 500 clubs sportifs
          </p>
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;
