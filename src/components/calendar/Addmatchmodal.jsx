import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { matchService } from '@/services/firebase';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

export default function AddMatchModal({ onClose, onSuccess }) {
  const { selectedTeamId, userData } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    opponent: '',
    date: '',
    time: '',
    location: '',
    isHome: 'true',
    competition: '',
    scoreTeam: '',
    scoreOpponent: '',
    status: 'upcoming'
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.opponent.trim()) {
      setError('Le nom de l\'adversaire est requis');
      return;
    }
    if (!formData.date) {
      setError('La date est requise');
      return;
    }
    if (!formData.time) {
      setError('L\'heure est requise');
      return;
    }

    try {
      setIsLoading(true);

      // Combiner date et heure
      const [hours, minutes] = formData.time.split(':');
      const matchDate = new Date(formData.date);
      matchDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const clubId = userData?.memberships?.[0]?.clubId;

      const matchData = {
        opponent: formData.opponent.trim(),
        date: matchDate,
        location: formData.location.trim() || null,
        isHome: formData.isHome === 'true',
        competition: formData.competition.trim() || null,
        status: formData.status,
        scoreTeam: formData.scoreTeam ? parseInt(formData.scoreTeam) : null,
        scoreOpponent: formData.scoreOpponent ? parseInt(formData.scoreOpponent) : null
      };

      await matchService.createMatch(clubId, selectedTeamId, matchData);
      onSuccess();
    } catch (err) {
      console.error('Erreur lors de la création du match:', err);
      setError('Une erreur est survenue lors de la création du match');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Nouveau match</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Informations générales</h3>

            <Input
              label="Adversaire *"
              name="opponent"
              value={formData.opponent}
              onChange={handleChange}
              placeholder="Ex: FC Marseille"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date *"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <Input
                label="Heure *"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>

            <Select
              label="Lieu du match *"
              name="isHome"
              value={formData.isHome}
              onChange={handleChange}
              required
            >
              <option value="true">Domicile</option>
              <option value="false">Extérieur</option>
            </Select>

            <Input
              label="Lieu / Adresse"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ex: Stade Vélodrome, Marseille"
            />

            <Input
              label="Compétition"
              name="competition"
              value={formData.competition}
              onChange={handleChange}
              placeholder="Ex: Championnat U15, Coupe départementale"
            />
          </div>

          {/* Score (optionnel) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Score</h3>
              <span className="text-sm text-gray-500">(optionnel)</span>
            </div>

            <Select
              label="Statut"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="upcoming">À venir</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </Select>

            {formData.status === 'completed' && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Score équipe"
                  name="scoreTeam"
                  type="number"
                  min="0"
                  value={formData.scoreTeam}
                  onChange={handleChange}
                  placeholder="0"
                />

                <Input
                  label="Score adversaire"
                  name="scoreOpponent"
                  type="number"
                  min="0"
                  value={formData.scoreOpponent}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Création...' : 'Créer le match'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}