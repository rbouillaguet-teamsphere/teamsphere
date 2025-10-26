// src/components/ui/Button.jsx
import React from 'react';

/**
 * Composant Button réutilisable avec différentes variantes
 * @param {object} props - Props du composant
 * @param {React.ReactNode} props.children - Contenu du bouton
 * @param {'primary'|'secondary'|'danger'|'ghost'} props.variant - Style du bouton
 * @param {'sm'|'md'|'lg'} props.size - Taille du bouton
 * @param {boolean} props.disabled - Bouton désactivé
 * @param {boolean} props.loading - État de chargement
 * @param {string} props.className - Classes CSS additionnelles
 * @param {function} props.onClick - Fonction de clic
 * @param {string} props.type - Type du bouton (button, submit, reset)
 */
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]} 
        ${sizes[size]}
        rounded-lg 
        font-medium 
        transition-colors 
        duration-200
        disabled:opacity-50 
        disabled:cursor-not-allowed
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-blue-500
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Chargement...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;