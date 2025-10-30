// src/pages/statistics/ChartsPage.jsx
import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import PerformanceChart from '../../components/stats/PerformanceChart';

const ChartsPage = () => {
  const { matches, selectedTeamId } = useApp();
  const [periodFilter, setPeriodFilter] = useState('all');

  const completedMatches = useMemo(() => {
    return matches.filter(match => match.status === 'completed');
  }, [matches]);

  const filteredMatches = useMemo(() => {
    let filtered = [...completedMatches];

    if (periodFilter === 'last5') {
      filtered = filtered.slice(-5);
    } else if (periodFilter === 'last10') {
      filtered = filtered.slice(-10);
    }

    return filtered;
  }, [completedMatches, periodFilter]);

  if (!selectedTeamId) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Sélectionnez une équipe pour voir les statistiques</p>
        </div>
      </div>
    );
  }

  if (completedMatches.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Graphiques</h1>
          <p className="text-gray-600 mt-2">Visualisations des performances</p>
        </div>
        <Card className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-medium">Aucun match complété</p>
          <p className="text-gray-500 text-sm mt-2">Les graphiques apparaîtront une fois que des matchs seront terminés</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Graphiques</h1>
        <p className="text-gray-600 mt-2">Visualisations des tendances et performances</p>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setPeriodFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            periodFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          Toute la saison
        </button>
        <button
          onClick={() => setPeriodFilter('last10')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            periodFilter === 'last10'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          10 derniers
        </button>
        <button
          onClick={() => setPeriodFilter('last5')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            periodFilter === 'last5'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          5 derniers
        </button>
      </div>

      {/* Graphiques */}
      <PerformanceChart matches={filteredMatches} />
    </div>
  );
};

export default ChartsPage;