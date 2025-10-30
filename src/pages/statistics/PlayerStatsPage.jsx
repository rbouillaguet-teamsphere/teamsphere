// src/pages/statistics/PlayerStatsPage.jsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import PlayersStats from '../../components/stats/PlayersStats';

const PlayerStatsPage = () => {
  const { players, matches, selectedTeamId } = useApp();

  const completedMatches = matches.filter(match => match.status === 'completed');

  if (!selectedTeamId) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Sélectionnez une équipe pour voir les statistiques</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Statistiques par joueur</h1>
        <p className="text-gray-600 mt-2">Performances individuelles et classements</p>
      </div>

      {/* Tableau des joueurs */}
      <PlayersStats players={players} matches={completedMatches} />
    </div>
  );
};

export default PlayerStatsPage;