import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import StatsOverview from '../components/stats/StatsOverview';
import PerformanceChart from '../components/stats/PerformanceChart';
import MatchesTable from '../components/stats/MatchesTable';
import ComparisonStats from '../components/stats/ComparisonStats';
import PlayersStats from '../components/stats/PlayersStats';

const StatsPage = () => {
  const { matches, players, selectedTeamId } = useApp();
  const [periodFilter, setPeriodFilter] = useState('all'); // all, last5, last10, season
  const [venueFilter, setVenueFilter] = useState('all'); // all, home, away

  // Filtrer les matchs complétés
  const completedMatches = useMemo(() => {
    return matches.filter(match => match.status === 'completed');
  }, [matches]);

  // Appliquer les filtres
  const filteredMatches = useMemo(() => {
    let filtered = [...completedMatches];

    // Filtre par lieu
    if (venueFilter === 'home') {
      filtered = filtered.filter(m => m.isHome);
    } else if (venueFilter === 'away') {
      filtered = filtered.filter(m => !m.isHome);
    }

    // Filtre par période
    if (periodFilter === 'last5') {
      filtered = filtered.slice(-5);
    } else if (periodFilter === 'last10') {
      filtered = filtered.slice(-10);
    }

    return filtered;
  }, [completedMatches, periodFilter, venueFilter]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    if (filteredMatches.length === 0) {
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

    const wins = filteredMatches.filter(m => m.scoreTeam > m.scoreOpponent).length;
    const draws = filteredMatches.filter(m => m.scoreTeam === m.scoreOpponent).length;
    const losses = filteredMatches.filter(m => m.scoreTeam < m.scoreOpponent).length;
    
    const goalsScored = filteredMatches.reduce((sum, m) => sum + (m.scoreTeam || 0), 0);
    const goalsConceded = filteredMatches.reduce((sum, m) => sum + (m.scoreOpponent || 0), 0);

    const homeMatches = filteredMatches.filter(m => m.isHome);
    const homeWins = homeMatches.filter(m => m.scoreTeam > m.scoreOpponent).length;
    
    const awayMatches = filteredMatches.filter(m => !m.isHome);
    const awayWins = awayMatches.filter(m => m.scoreTeam > m.scoreOpponent).length;

  // Calculer la série actuelle (victoires ou défaites consécutives)
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
  
    // Calculer la série actuelle
    const currentStreak = calculateStreak(filteredMatches);

    return {
      matchesPlayed: filteredMatches.length,
      wins,
      draws,
      losses,
      winRate: filteredMatches.length > 0 ? ((wins / filteredMatches.length) * 100).toFixed(1) : 0,
      goalsScored,
      goalsConceded,
      goalDifference: goalsScored - goalsConceded,
      homeWins,
      awayWins,
      currentStreak
    };
  }, [filteredMatches]);


  // État de chargement
  if (!selectedTeamId) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Sélectionnez une équipe pour voir les statistiques</p>
        </div>
      </div>
    );
  }

  // État vide
  if (completedMatches.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-600 mt-2">Analyse des performances de l'équipe</p>
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
        <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-600 mt-2">Analyse des performances de l'équipe</p>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex gap-2">
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

        <div className="flex gap-2">
          <button
            onClick={() => setVenueFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              venueFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Tous les matchs
          </button>
          <button
            onClick={() => setVenueFilter('home')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              venueFilter === 'home'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Domicile
          </button>
          <button
            onClick={() => setVenueFilter('away')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              venueFilter === 'away'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Extérieur
          </button>
        </div>
      </div>

      {/* Vue d'ensemble */}
      <StatsOverview stats={stats} />

      {/* Graphique de performance */}
      <div className="mt-6">
        <PerformanceChart matches={filteredMatches} />
      </div>

      {/* Comparaisons */}
      <div className="mt-6">
        <ComparisonStats 
          matches={completedMatches}
          homeWins={stats.homeWins}
          awayWins={stats.awayWins}
        />
      </div>

      {/* Statistiques des joueurs */}
      <div className="mt-6">
        <PlayersStats players={players} matches={filteredMatches} />
      </div>

      {/* Tableau des matchs */}
      <div className="mt-6">
        <MatchesTable matches={filteredMatches} />
      </div>
    </div>
  );
};

export default StatsPage;