// src/components/ui/Input.jsx
import React from 'react';

/**
 * Composant Input réutilisable avec label et gestion d'erreurs
 * @param {object} props - Props du composant
 * @param {string} props.label - Label du champ
 * @param {string} props.error - Message d'erreur
 * @param {string} props.hint - Texte d'aide
 * @param {string} props.type - Type d'input
 * @param {boolean} props.required - Champ requis
 * @param {string} props.className - Classes CSS additionnelles
 */
export const Input = ({ 
  label, 
  error, 
  hint,
  type = 'text',
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        className={`
          w-full 
          px-4 
          py-3 
          border 
          rounded-lg 
          focus:ring-2 
          focus:ring-blue-500 
          focus:border-transparent
          transition-colors
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
        `}
        {...props}
      />
      
      {hint && !error && (
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;