import { useState, useEffect } from 'react';
import { attendanceService } from '@/services/firebase';
import { useApp } from '@/context/AppContext';
import Button from '../ui/Button';

export default function AttendanceTracker({ event, players = [], onClose, onSuccess }) {
  const { selectedClubId, selectedTeamId, user } = useApp();
  const [attendances, setAttendances] = useState({});
  const [reasons, setReasons] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadExistingAttendances();
  }, [event]);

  async function loadExistingAttendances() {
    if (!event?.id) return;
    
    try {
      setIsLoading(true);
      const existingAttendances = await attendanceService.getEventAttendances(
        selectedClubId,
        selectedTeamId,
        event.id
      );
      
      // Transformer en objet pour faciliter l'accès
      const attendanceMap = {};
      const reasonMap = {};
      
      existingAttendances.forEach(att => {
        attendanceMap[att.playerId] = att.present ? 'present' : 'absent';
        if (att.reason) {
          reasonMap[att.playerId] = att.reason;
        }
      });
      
      setAttendances(attendanceMap);
      setReasons(reasonMap);
    } catch (error) {
      console.error('Erreur chargement présences:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const setPlayerStatus = (playerId, status) => {
    setAttendances(prev => ({
      ...prev,
      [playerId]: status
    }));
    
    // Effacer la raison si le joueur est présent
    if (status === 'present' && reasons[playerId]) {
      setReasons(prev => {
        const newReasons = { ...prev };
        delete newReasons[playerId];
        return newReasons;
      });
    }
  };

  const setPlayerReason = (playerId, reason) => {
    setReasons(prev => ({
      ...prev,
      [playerId]: reason
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const attendanceData = players.map(player => ({
        playerId: player.id,
        present: attendances[player.id] === 'present',
        reason: attendances[player.id] === 'absent' ? reasons[player.id] : null
      }));

      await attendanceService.recordBulkAttendances(
        selectedClubId,
        selectedTeamId,
        event.id,
        attendanceData,
        user.uid
      );
      
      alert('Présences enregistrées avec succès !');
      onSuccess?.();
    } catch (error) {
      console.error('Erreur enregistrement présences:', error);
      alert('Erreur lors de l\'enregistrement. Veuillez réessayer.');
    } finally {
      setIsSaving(false);
    }
  };

  const stats = players.reduce((acc, player) => {
    const status = attendances[player.id];
    if (status === 'present') acc.present++;
    else if (status === 'absent') acc.absent++;
    else acc.pending++;
    return acc;
  }, { present: 0, absent: 0, pending: 0 });

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
        <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6 animate-modal-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Feuille de présence</h2>
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

          {/* Statistiques */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{players.length}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
              <div className="text-sm text-gray-500">Présents</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
              <div className="text-sm text-gray-500">Absents</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-500">Non pointés</div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                const allPresent = {};
                players.forEach(p => allPresent[p.id] = 'present');
                setAttendances(allPresent);
              }}
              className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              ✅ Tous présents
            </button>
            <button
              onClick={() => {
                const allAbsent = {};
                players.forEach(p => allAbsent[p.id] = 'absent');
                setAttendances(allAbsent);
              }}
              className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              ❌ Tous absents
            </button>
            <button
              onClick={() => {
                setAttendances({});
                setReasons({});
              }}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              🔄 Réinitialiser
            </button>
          </div>

          {/* Liste des joueurs */}
          <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
            {players.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun joueur dans l'équipe
              </div>
            ) : (
              players.map(player => {
                const status = attendances[player.id];
                
                return (
                  <div
                    key={player.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium text-gray-900">
                            {player.firstName} {player.lastName}
                          </div>
                          {player.position && (
                            <div className="text-sm text-gray-500">{player.position}</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Boutons de statut */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPlayerStatus(player.id, 'present')}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            status === 'present'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          ✅ Présent
                        </button>
                        <button
                          onClick={() => setPlayerStatus(player.id, 'absent')}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            status === 'absent'
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          ❌ Absent
                        </button>
                      </div>
                    </div>
                    
                    {/* Champ raison si absent */}
                    {status === 'absent' && (
                      <div className="mt-3">
                        <input
                          type="text"
                          value={reasons[player.id] || ''}
                          onChange={(e) => setPlayerReason(player.id, e.target.value)}
                          placeholder="Raison de l'absence (optionnel)"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={isSaving}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving ? 'Enregistrement...' : '💾 Enregistrer'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
