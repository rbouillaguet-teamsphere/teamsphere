import { useState } from 'react';
import { matchService } from '@/services/firebase';
import { useApp } from '@/context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

export default function AddMatchModal({ onClose, onSuccess }) {
  const { selectedClubId, selectedTeamId } = useApp();
  
  const [formData, setFormData] = useState({
    opponent: '',
    date: '',
    time: '',
    isHome: true,
    location: '',
    competition: '',
    status: 'upcoming',
    scoreTeam: '',
    scoreOpponent: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Options pour le select du type de match
  const matchTypeOptions = [
    { value: true, label: 'Domicile' },
    { value: false, label: 'Extérieur' }
  ];

  // Options pour le statut
  const statusOptions = [
    { value: 'upcoming', label: 'À venir' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.opponent.trim()) {
      newErrors.opponent = 'Le nom de l\'adversaire est requis';
    }

    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }

    if (!formData.time) {
      newErrors.time = 'L\'heure est requise';
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

      // Combiner date et heure en Timestamp
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      const matchData = {
        opponent: formData.opponent.trim(),
        date: dateTime,
        isHome: formData.isHome,
        location: formData.location.trim(),
        competition: formData.competition.trim(),
        status: formData.status,
        teamId: selectedTeamId
      };

      // Ajouter les scores si le match est terminé
      if (formData.status === 'completed') {
        matchData.scoreTeam = parseInt(formData.scoreTeam) || 0;
        matchData.scoreOpponent = parseInt(formData.scoreOpponent) || 0;
      }

      await matchService.create(selectedClubId, selectedTeamId, matchData);
      
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la création du match:', error);
      alert('Erreur lors de la création du match. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h2 className="text-2xl font-bold text-gray-900">Nouveau match</h2>
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
            {/* Adversaire */}
            <Input
              label="Adversaire *"
              value={formData.opponent}
              onChange={(e) => handleChange('opponent', e.target.value)}
              placeholder="Nom de l'équipe adverse"
              error={errors.opponent}
            />

            {/* Date et Heure */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date *"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                error={errors.date}
              />
              <Input
                label="Heure *"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                error={errors.time}
              />
            </div>

            {/* Type de match et Statut */}
            <div className="grid grid-cols-2 gap-4">
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

              <Select
                label="Statut *"
                options={statusOptions}
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              />
            </div>

            {/* Lieu */}
            <Input
              label="Lieu"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Adresse du stade"
            />

            {/* Compétition */}
            <Input
              label="Compétition"
              value={formData.competition}
              onChange={(e) => handleChange('competition', e.target.value)}
              placeholder="Championnat, Coupe, etc."
            />

            {/* Scores - affichés seulement si le match est terminé */}
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
                {isSubmitting ? 'Création...' : 'Créer le match'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default AddMatchModal;