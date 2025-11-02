import { useState, useEffect } from 'react';
import { eventService } from '@/services/firebase';
import { useApp } from '@/context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

export default function EventModal({ event = null, onClose, onSuccess }) {
  const { selectedClubId, selectedTeamId } = useApp();
  const isEditing = !!event;
  
  const [formData, setFormData] = useState({
    type: event?.type || 'training',
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date ? new Date(event.date).toISOString().split('T')[0] : '',
    startTime: event?.startTime || '',
    endTime: event?.endTime || '',
    location: event?.location || '',
    
    // Champs spécifiques au type "match"
    opponent: event?.opponent || '',
    isHome: event?.isHome ?? true,
    competition: event?.competition || '',
    status: event?.status || 'upcoming',
    scoreTeam: event?.scoreTeam || '',
    scoreOpponent: event?.scoreOpponent || '',
    
    // Options de convocation
    requiresConvocation: event?.requiresConvocation ?? true,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Options pour le type d'événement
  const eventTypeOptions = [
    { value: 'training', label: '🏃 Entraînement', color: 'blue' },
    { value: 'match', label: '⚽ Match', color: 'green' },
    { value: 'meeting', label: '👥 Réunion', color: 'purple' },
    { value: 'other', label: '📌 Autre', color: 'gray' }
  ];

  // Options pour le statut (seulement pour les matchs)
  const statusOptions = [
    { value: 'upcoming', label: 'À venir' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Validation commune
    if (formData.type === 'match' && !formData.opponent.trim()) {
      newErrors.opponent = 'Le nom de l\'adversaire est requis';
    }
    
    if (formData.type !== 'match' && !formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'L\'heure de début est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (!selectedClubId || !selectedTeamId) {
      alert('Équipe non sélectionnée');
      return;
    }

    try {
      setIsSubmitting(true);

      // Construire les dates
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = formData.endTime 
        ? new Date(`${formData.date}T${formData.endTime}`)
        : null;

      // Données communes
      const eventData = {
        type: formData.type,
        date: startDateTime,
        startTime: formData.startTime,
        endTime: formData.endTime || null,
        dateEnd: endDateTime,
        location: formData.location.trim(),
        description: formData.description.trim(),
        requiresConvocation: formData.requiresConvocation,
        teamId: selectedTeamId,
        clubId: selectedClubId,
      };

      // Données spécifiques selon le type
      if (formData.type === 'match') {
        eventData.title = `${formData.isHome ? 'vs' : '@'} ${formData.opponent}`;
        eventData.opponent = formData.opponent.trim();
        eventData.isHome = formData.isHome;
        eventData.competition = formData.competition.trim();
        eventData.status = formData.status;

        if (formData.status === 'completed') {
          eventData.scoreTeam = parseInt(formData.scoreTeam) || 0;
          eventData.scoreOpponent = parseInt(formData.scoreOpponent) || 0;
        }
      } else {
        eventData.title = formData.title.trim();
      }

      if (isEditing) {
        await eventService.update(selectedClubId, selectedTeamId, event.id, eventData);
      } else {
        await eventService.create(selectedClubId, selectedTeamId, eventData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentEventType = eventTypeOptions.find(t => t.value === formData.type);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 animate-modal-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Modifier l\'événement' : 'Nouvel événement'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type d'événement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'événement *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {eventTypeOptions.map((typeOption) => (
                  <button
                    key={typeOption.value}
                    type="button"
                    onClick={() => handleChange('type', typeOption.value)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all text-left ${
                      formData.type === typeOption.value
                        ? `bg-${typeOption.color}-100 text-${typeOption.color}-700 border-2 border-${typeOption.color}-500`
                        : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    {typeOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Titre (sauf pour les matchs) ou Adversaire (pour les matchs) */}
            {formData.type === 'match' ? (
              <>
                <Input
                  label="Adversaire *"
                  value={formData.opponent}
                  onChange={(e) => handleChange('opponent', e.target.value)}
                  placeholder="Nom de l'équipe adverse"
                  error={errors.opponent}
                />
                
                {/* Domicile/Extérieur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de match *
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange('isHome', true)}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                        formData.isHome
                          ? 'bg-green-100 text-green-700 border-2 border-green-500'
                          : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                      }`}
                    >
                      🏠 Domicile
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('isHome', false)}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                        !formData.isHome
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                          : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                      }`}
                    >
                      ✈️ Extérieur
                    </button>
                  </div>
                </div>

                {/* Compétition */}
                <Input
                  label="Compétition"
                  value={formData.competition}
                  onChange={(e) => handleChange('competition', e.target.value)}
                  placeholder="Championnat, Coupe, etc."
                />

                {/* Statut */}
                <Select
                  label="Statut *"
                  options={statusOptions}
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                />

                {/* Scores si terminé */}
                {formData.status === 'completed' && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Score final</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Score équipe"
                        type="number"
                        min="0"
                        value={formData.scoreTeam}
                        onChange={(e) => handleChange('scoreTeam', e.target.value)}
                        placeholder="0"
                      />
                      <Input
                        label="Score adversaire"
                        type="number"
                        min="0"
                        value={formData.scoreOpponent}
                        onChange={(e) => handleChange('scoreOpponent', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Input
                label="Titre *"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ex: Entraînement technique"
                error={errors.title}
              />
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Détails de l'événement..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Date et Heures */}
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Date *"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                error={errors.date}
              />
              <Input
                label="Heure début *"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                error={errors.startTime}
              />
              <Input
                label="Heure fin"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
              />
            </div>

            {/* Lieu */}
            <Input
              label="Lieu"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Adresse du lieu"
            />

            {/* Option convocation */}
            <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <input
                type="checkbox"
                id="requiresConvocation"
                checked={formData.requiresConvocation}
                onChange={(e) => handleChange('requiresConvocation', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="requiresConvocation" className="text-sm text-gray-700 cursor-pointer">
                📨 Envoyer une convocation aux joueurs
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (isEditing ? 'Modification...' : 'Création...') 
                  : (isEditing ? 'Modifier' : 'Créer')
                }
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
