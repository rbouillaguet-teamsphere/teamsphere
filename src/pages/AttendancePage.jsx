import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { playerService } from '@/services/firebase';
import AttendanceStats from '@/components/calendar/AttendanceStats';
import Button from '@/components/ui/Button';

export default function AttendancePage() {
  const { selectedClubId, selectedTeamId } = useApp();
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, [selectedClubId, selectedTeamId]);

  async function loadPlayers() {
    if (!selectedClubId || !selectedTeamId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const playersData = await playerService.getTeamPlayers(selectedClubId, selectedTeamId);
      setPlayers(playersData);
    } catch (error) {
      console.error('Erreur chargement joueurs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!selectedClubId || !selectedTeamId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Statistiques de présence
          </h2>
          <p className="text-gray-600 mb-6">
            Sélectionnez une équipe pour voir les statistiques
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Présences & Statistiques
          </h1>
          <p className="text-gray-600">
            Suivez l'assiduité de votre équipe et identifiez les tendances
          </p>
        </div>

        {/* Statistiques de présence */}
        <AttendanceStats players={players} />
      </div>
    </div>
  );
}
