// src/pages/statistics/OverviewPage.jsx
import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import StatsOverview from '../../components/stats/StatsOverview';
import PerformanceChart from '../../components/stats/PerformanceChart';

const OverviewPage = () => {
  const { matches, selectedTeamId } = useApp();

  const completedMatches = useMemo(() => {
    return matches.filter(match => match.status === 'completed');
  }, [matches]);

  // Fonction pour calculer la série actuelle (AVANT le useMemo)
  const calculateStreak = (matches) => {
    if (matches.length === 0) return { type: 'none', count: 0 };

    const sortedMatches = [...matches].sort((a, b) => 
      b.date?.toMillis() - a.date?.toMillis()
    );

    let streakType = null;
    let streakCount = 0;

    for (const match of sortedMatches) {
      const result = match.scoreTeam > match.scoreOpponent ? 'win' : 
                     match.scoreTeam < match.scoreOpponent ? 'loss' : 'draw';

      if (streakType === null) {
        streakType = result;
        streakCount = 1;
      } else if (streakType === result) {
        streakCount++;
      } else {
        break;
      }
    }

    return { type: streakType || 'none', count: streakCount };
  };

  // Calcul des statistiques (APRÈS calculateStreak)
  const stats = useMemo(() => {
    if (completedMatches.length === 0) {
      return {
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        winRate: 0,
        goalsScored: 0,
        goalsConceded: 0,
        goalDifference: 0,
        homeWins: 0,
        awayWins: 0,
        currentStreak: { type: 'none', count: 0 }
      };
    }

    const wins = completedMatches.filter(m => m.scoreTeam > m.scoreOpponent).length;
    const draws = completedMatches.filter(m => m.scoreTeam === m.scoreOpponent).length;
    const losses = completedMatches.filter(m => m.scoreTeam < m.scoreOpponent).length;
    
    const goalsScored = completedMatches.reduce((sum, m) => sum + (m.scoreTeam || 0), 0);
    const goalsConceded = completedMatches.reduce((sum, m) => sum + (m.scoreOpponent || 0), 0);

    const homeMatches = completedMatches.filter(m => m.isHome);
    const homeWins = homeMatches.filter(m => m.scoreTeam > m.scoreOpponent).length;
    
    const awayMatches = completedMatches.filter(m => !m.isHome);
    const awayWins = awayMatches.filter(m => m.scoreTeam > m.scoreOpponent).length;

    const currentStreak = calculateStreak(completedMatches);

    return {
      matchesPlayed: completedMatches.length,
      wins,
      draws,
      losses,
      winRate: completedMatches.length > 0 ? ((wins / completedMatches.length) * 100).toFixed(1) : 0,
      goalsScored,
      goalsConceded,
      goalDifference: goalsScored - goalsConceded,
      homeWins,
      awayWins,
      currentStreak
    };
  }, [completedMatches]);

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
          <h1 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h1>
          <p className="text-gray-600 mt-2">Aperçu général des performances</p>
        </div>
        <Card className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-medium">Aucun match complété</p>
          <p className="text-gray-500 text-sm mt-2">Les statistiques apparaîtront une fois que des matchs seront terminés</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h1>
        <p className="text-gray-600 mt-2">Aperçu général des performances de l'équipe</p>
      </div>

      {/* Métriques clés */}
      <StatsOverview stats={stats} />

      {/* Graphique de performance */}
      <div className="mt-6">
        <PerformanceChart matches={completedMatches} />
      </div>
    </div>
  );
};

export default OverviewPage;