// src/components/onboarding/steps/TeamStep.jsx
import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/ui';

/**
 * Étape 2 : Création de l'équipe
 * @param {object} props - Props du composant
 * @param {object} props.data - Données accumulées du wizard
 * @param {function} props.onNext - Callback pour passer à l'étape suivante
 * @param {function} props.onBack - Callback pour revenir en arrière
 */
export const TeamStep = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    name: data?.team?.name || '',
    category: data?.team?.category || '',
    gender: data?.team?.gender || '',
    season: data?.team?.season || '2025-2026',
  });
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'seniors', label: 'Seniors' },
    { value: 'u23', label: 'U23' },
    { value: 'u21', label: 'U21' },
    { value: 'u19', label: 'U19' },
    { value: 'u17', label: 'U17' },
    { value: 'u15', label: 'U15' },
    { value: 'u13', label: 'U13' },
    { value: 'u11', label: 'U11' },
  ];

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Le nom de l'équipe est requis";
    }
    
    if (!formData.category) {
      newErrors.category = 'Sélectionnez une catégorie';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Sélectionnez un genre';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext({ team: formData });
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <h2 className="text-2xl font-bold mb-2">Créez votre première équipe</h2>
      <p className="text-gray-600 mb-6">
        Ajoutez une équipe à votre club <strong>{data?.club?.name}</strong>
      </p>

      {/* Nom de l'équipe */}
      <Input
        label="Nom de l'équipe"
        placeholder="Ex: Seniors Masculins, U19..."
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        required
      />

      {/* Catégorie */}
      <Select
        label="Catégorie"
        options={categories}
        value={formData.category}
        onChange={(e) => handleChange('category', e.target.value)}
        error={errors.category}
        required
      />

      {/* Genre */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Genre <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-4">
          {[
            { value: 'masculin', label: 'Masculin', icon: '♂️' },
            { value: 'feminin', label: 'Féminin', icon: '♀️' },
            { value: 'mixte', label: 'Mixte', icon: '⚥' }
          ].map(gender => (
            <label 
              key={gender.value} 
              className={`
                flex items-center space-x-2 cursor-pointer px-4 py-2 rounded-lg border-2 transition-all
                ${formData.gender === gender.value 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <input
                type="radio"
                name="gender"
                value={gender.value}
                checked={formData.gender === gender.value}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span>{gender.icon}</span>
              <span className="capitalize">{gender.label}</span>
            </label>
          ))}
        </div>
        {errors.gender && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.gender}
          </p>
        )}
      </div>

      {/* Saison */}
      <Input
        label="Saison"
        placeholder="Ex: 2025-2026"
        value={formData.season}
        onChange={(e) => handleChange('season', e.target.value)}
      />

      {/* Astuce */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-blue-700">
          💡 <strong>Astuce :</strong> Vous pourrez ajouter d'autres équipes plus tard
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          ← Retour
        </Button>
        <Button type="submit">
          Suivant →
        </Button>
      </div>
    </form>
  );
};

export default TeamStep;