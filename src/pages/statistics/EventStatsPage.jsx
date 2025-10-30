// src/pages/statistics/EventStatsPage.jsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import MatchesTable from '../../components/stats/MatchesTable';

const EventStatsPage = () => {
  const { matches, selectedTeamId } = useApp();

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
        <h1 className="text-3xl font-bold text-gray-900">Statistiques par événement</h1>
        <p className="text-gray-600 mt-2">Analyse détaillée de chaque match</p>
      </div>

      {/* Tableau des matchs */}
      <MatchesTable matches={completedMatches} />
    </div>
  );
};

export default EventStatsPage;