// src/components/onboarding/ProgressBar.jsx
import React from 'react';

/**
 * Composant ProgressBar pour le wizard d'onboarding
 * @param {object} props - Props du composant
 * @param {number} props.currentStep - Index de l'étape actuelle (0-based)
 * @param {number} props.totalSteps - Nombre total d'étapes
 * @param {Array} props.steps - Tableau des étapes [{id, title}]
 */
export const ProgressBar = ({ currentStep, totalSteps, steps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      {/* Labels des étapes */}
      <div className="flex justify-between mb-3">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`
              text-xs 
              font-medium 
              transition-colors
              ${idx <= currentStep ? 'text-blue-600' : 'text-gray-400'}
            `}
          >
            {/* Afficher le titre sur desktop, numéro sur mobile */}
            <span className="hidden sm:inline">{step.title}</span>
            <span className="sm:hidden">{idx + 1}</span>
          </div>
        ))}
      </div>

      {/* Barre de progression */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Indicateur d'étape */}
      <div className="mt-2 text-center">
        <span className="text-sm text-gray-600">
          Étape {currentStep + 1} sur {totalSteps}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;