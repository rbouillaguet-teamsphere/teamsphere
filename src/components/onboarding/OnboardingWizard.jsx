// src/components/onboarding/OnboardingWizard.jsx
// ✅ VERSION FINALE avec navigation et Firebase

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext'; // ✨ AJOUTER
import { Card } from '@/components/ui';
import { ProgressBar } from './ProgressBar';
import { SuccessScreen } from './SuccessScreen';
import { ClubStep, TeamStep, PlayersStep, InvitesStep } from './steps';

const STEPS = [
  { id: 'club', title: 'Club', component: ClubStep },
  { id: 'team', title: 'Équipe', component: TeamStep },
  { id: 'players', title: 'Joueurs', component: PlayersStep },
  { id: 'invites', title: 'Invitations', component: InvitesStep },
];

/**
 * Wizard d'onboarding principal
 */
export const OnboardingWizard = () => {  // ⚠️ ENLEVER les props
  const { completeOnboarding } = useApp(); // ✨ AJOUTER
  
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNext = (stepData) => {
    const newData = { ...data, ...stepData };
    setData(newData);

    if (currentStep === STEPS.length - 1) {
      setShowSuccess(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSuccess(true);
    }
  };

  // ✨ MODIFIER cette fonction
  const handleComplete = async () => {
    try {
      console.log('🚀 Démarrage de l\'onboarding avec:', data);
      
      // Appeler la fonction du Context qui :
      // - Crée le club
      // - Crée l'équipe
      // - Ajoute les joueurs
      // - Envoie les invitations
      // - Redirige vers le dashboard
      await completeOnboarding(data);
      
      // La redirection est gérée dans completeOnboarding()
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'onboarding:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <SuccessScreen data={data} onComplete={handleComplete} />
        </Card>
      </div>
    );
  }

  const Step = STEPS[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={STEPS.length}
          steps={STEPS}
        />
        <Step
          data={data}
          onNext={handleNext}
          onBack={handleBack}
          onSkip={handleSkip}
        />
      </Card>
    </div>
  );
};

export default OnboardingWizard;