// src/components/onboarding/steps/ClubStep.jsx
import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/ui';

/**
 * Étape 1 : Création du club
 * @param {object} props - Props du composant
 * @param {object} props.data - Données accumulées du wizard
 * @param {function} props.onNext - Callback pour passer à l'étape suivante
 * @param {function} props.onBack - Callback pour revenir en arrière
 */
export const ClubStep = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    name: data?.club?.name || '',
    sport: data?.club?.sport || '',
    city: data?.club?.city || '',
  });
  const [errors, setErrors] = useState({});

  const sports = [
    { value: 'rugby', label: '🏉 Rugby' },
    { value: 'football', label: '⚽ Football' },
    { value: 'basketball', label: '🏀 Basketball' },
    { value: 'handball', label: '🤾 Handball' },
    { value: 'volleyball', label: '🏐 Volleyball' },
    { value: 'hockey', label: '🏑 Hockey' },
    { value: 'tennis', label: '🎾 Tennis' },
    { value: 'autre', label: '🏆 Autre' },
  ];

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du club est requis';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Le nom doit faire au moins 3 caractères';
    }
    
    if (!formData.sport) {
      newErrors.sport = 'Sélectionnez un sport';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext({ club: formData });
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <h2 className="text-2xl font-bold mb-2">Créez votre premier club</h2>
      <p className="text-gray-600 mb-6">
        Commençons par les informations de base de votre club
      </p>

      {/* Nom du club */}
      <Input
        label="Nom du club"
        placeholder="Ex: ROC Giffois, Racing 92..."
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        required
      />

      {/* Sport */}
      <Select
        label="Sport"
        options={sports}
        value={formData.sport}
        onChange={(e) => handleChange('sport', e.target.value)}
        error={errors.sport}
        required
      />

      {/* Ville */}
      <Input
        label="Ville"
        placeholder="Ex: Gif-sur-Yvette"
        value={formData.city}
        onChange={(e) => handleChange('city', e.target.value)}
        error={errors.city}
        required
      />

      {/* Astuce */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-blue-700">
          💡 <strong>Astuce :</strong> Vous pourrez ajouter un logo et d'autres détails plus tard
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

export default ClubStep;