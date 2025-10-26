// src/components/ui/Select.jsx
import React from 'react';

/**
 * Composant Select réutilisable
 * @param {object} props - Props du composant
 * @param {string} props.label - Label du champ
 * @param {Array} props.options - Options du select [{value, label}]
 * @param {string} props.error - Message d'erreur
 * @param {string} props.placeholder - Texte du placeholder
 * @param {boolean} props.required - Champ requis
 */
export const Select = ({ 
  label, 
  options = [], 
  error,
  placeholder = 'Sélectionner...',
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
      
      <select
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
          bg-white
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      
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

export default Select;