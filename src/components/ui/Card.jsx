// src/components/ui/Card.jsx
import React from 'react';

/**
 * Composant Card pour conteneur avec ombre
 * @param {object} props - Props du composant
 * @param {React.ReactNode} props.children - Contenu de la carte
 * @param {string} props.className - Classes CSS additionnelles
 * @param {function} props.onClick - Fonction de clic (optionnel)
 */
export const Card = ({ children, className = '', onClick, ...props }) => {
  const baseClasses = 'bg-white rounded-lg shadow-lg p-6';
  const clickableClasses = onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : '';

  return (
    <div
      className={`${baseClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;