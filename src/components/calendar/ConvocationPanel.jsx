import { useState, useEffect } from 'react';
import { convocationService } from '@/services/firebase';
import { useApp } from '@/context/AppContext';
import Button from '../ui/Button';

export default function ConvocationPanel({ event, players = [], onClose, onSuccess }) {
  const { selectedClubId, selectedTeamId } = useApp();
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [existingConvocations, setExistingConvocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadExistingConvocations();
  }, [event]);

  async function loadExistingConvocations() {
    if (!event?.id) return;
    
    try {
      setIsLoading(true);
      const convocs = await convocationService.getEventConvocations(
        selectedClubId,
        selectedTeamId,
        event.id
      );
      setExistingConvocations(convocs);
      
      // Pré-sélectionner les joueurs déjà convoqués
      const convoquedPlayerIds = convocs.map(c => c.playerId);
      setSelectedPlayers(convoquedPlayerIds);
    } catch (error) {
      console.error('Erreur chargement convocations:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const togglePlayer = (playerId) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const toggleAll = () => {
    if (selectedPlayers.length === players.length) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers(players.map(p => p.id));
    }
  };

  const handleSend = async () => {
    if (selectedPlayers.length === 0) {
      alert('Veuillez sélectionner au moins un joueur');
      return;
    }

    try {
      setIsSending(true);
      await convocationService.createConvocations(
        selectedClubId,
        selectedTeamId,
        event.id,
        selectedPlayers
      );
      
      alert(`Convocation envoyée à ${selectedPlayers.length} joueur(s) !`);
      onSuccess?.();
    } catch (error) {
      console.error('Erreur envoi convocations:', error);
      alert('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSending(false);
    }
  };

  const getConvocationStatus = (playerId) => {
    const convoc = existingConvocations.find(c => c.playerId === playerId);
    if (!convoc) return null;
    
    const statusConfig = {
      pending: { label: '⏳ En attente', color: 'gray' },
      accepted: { label: '✅ Accepté', color: 'green' },
      declined: { label: '❌ Refusé', color: 'red' },
      maybe: { label: '🤔 Peut-être', color: 'yellow' },
    };
    
    return statusConfig[convoc.status] || statusConfig.pending;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 animate-modal-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Convoquer les joueurs</h2>
              <p className="text-gray-500 mt-1">{event.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Info événement */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-sm text-blue-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {new Date(event.date?.toDate?.() || event.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center space-x-2 text-sm text-blue-700 mt-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {/* Sélection rapide */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              Joueurs ({selectedPlayers.length}/{players.length})
            </h3>
            <button
              onClick={toggleAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {selectedPlayers.length === players.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          </div>

          {/* Liste des joueurs */}
          <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
            {players.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun joueur dans l'équipe
              </div>
            ) : (
              players.map(player => {
                const isSelected = selectedPlayers.includes(player.id);
                const status = getConvocationStatus(player.id);
                
                return (
                  <div
                    key={player.id}
                    onClick={() => togglePlayer(player.id)}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {player.firstName} {player.lastName}
                        </div>
                        {player.position && (
                          <div className="text-sm text-gray-500">{player.position}</div>
                        )}
                      </div>
                    </div>
                    
                    {status && (
                      <span className={`text-sm px-3 py-1 rounded-full bg-${status.color}-100 text-${status.color}-700`}>
                        {status.label}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Statistiques */}
          {existingConvocations.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {existingConvocations.length}
                  </div>
                  <div className="text-xs text-gray-500">Convoqués</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {existingConvocations.filter(c => c.status === 'accepted').length}
                  </div>
                  <div className="text-xs text-gray-500">Présents</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {existingConvocations.filter(c => c.status === 'declined').length}
                  </div>
                  <div className="text-xs text-gray-500">Absents</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-500">
                    {existingConvocations.filter(c => c.status === 'pending').length}
                  </div>
                  <div className="text-xs text-gray-500">En attente</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={isSending}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleSend}
              className="flex-1"
              disabled={isSending || selectedPlayers.length === 0}
            >
              {isSending 
                ? 'Envoi en cours...' 
                : `📨 Envoyer (${selectedPlayers.length})`
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
