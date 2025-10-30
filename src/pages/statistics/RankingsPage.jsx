// src/pages/statistics/RankingsPage.jsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import ComparisonStats from '../../components/stats/ComparisonStats';
import Card from '../../components/ui/Card';

const RankingsPage = () => {
  const { matches, selectedTeamId } = useApp();

  const completedMatches = matches.filter(match => match.status === 'completed');

  const stats = React.useMemo(() => {
    const homeMatches = completedMatches.filter(m => m.isHome);
    const homeWins = homeMatches.filter(m => m.scoreTeam > m.scoreOpponent).length;
    
    const awayMatches = completedMatches.filter(m => !m.isHome);
    const awayWins = awayMatches.filter(m => m.scoreTeam > m.scoreOpponent).length;

    return { homeWins, awayWins };
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
          <h1 className="text-3xl font-bold text-gray-900">Classements</h1>
          <p className="text-gray-600 mt-2">Comparaisons et performances</p>
        </div>
        <Card className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-medium">Aucun match complété</p>
          <p className="text-gray-500 text-sm mt-2">Les classements apparaîtront une fois que des matchs seront terminés</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Classements</h1>
        <p className="text-gray-600 mt-2">Comparaisons et performances par catégorie</p>
      </div>

      {/* Comparaisons domicile/extérieur */}
      <ComparisonStats 
        matches={completedMatches}
        homeWins={stats.homeWins}
        awayWins={stats.awayWins}
      />
    </div>
  );
};

export default RankingsPage;