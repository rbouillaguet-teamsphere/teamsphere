import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';

const MatchesTable = ({ matches }) => {
  const [filterResult, setFilterResult] = useState('all'); // all, win, draw, loss
  const [filterVenue, setFilterVenue] = useState('all'); // all, home, away

  const filteredMatches = useMemo(() => {
    let filtered = [...matches];

    // Filtre par résultat
    if (filterResult !== 'all') {
      filtered = filtered.filter(match => {
        const result = match.scoreTeam > match.scoreOpponent ? 'win' : 
                       match.scoreTeam < match.scoreOpponent ? 'loss' : 'draw';
        return result === filterResult;
      });
    }

    // Filtre par lieu
    if (filterVenue === 'home') {
      filtered = filtered.filter(m => m.isHome);
    } else if (filterVenue === 'away') {
      filtered = filtered.filter(m => !m.isHome);
    }

    // Trier par date décroissante (plus récent en premier)
    filtered.sort((a, b) => b.date?.toMillis() - a.date?.toMillis());

    return filtered;
  }, [matches, filterResult, filterVenue]);

  const getResultBadge = (match) => {
    const result = match.scoreTeam > match.scoreOpponent ? 'win' : 
                   match.scoreTeam < match.scoreOpponent ? 'loss' : 'draw';
    
    const badges = {
      win: { label: 'V', className: 'bg-green-100 text-green-800' },
      loss: { label: 'D', className: 'bg-red-100 text-red-800' },
      draw: { label: 'N', className: 'bg-gray-100 text-gray-800' }
    };

    const badge = badges[result];
    return (
      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate();
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (matches.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Historique des matchs</h2>
        <p className="text-sm text-gray-600 mt-1">{filteredMatches.length} match(s)</p>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterResult('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterResult === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilterResult('win')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterResult === 'win'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Victoires
          </button>
          <button
            onClick={() => setFilterResult('draw')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterResult === 'draw'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Nuls
          </button>
          <button
            onClick={() => setFilterResult('loss')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterResult === 'loss'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Défaites
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterVenue('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterVenue === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous les lieux
          </button>
          <button
            onClick={() => setFilterVenue('home')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterVenue === 'home'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🏠 Domicile
          </button>
          <button
            onClick={() => setFilterVenue('away')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterVenue === 'away'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ✈️ Extérieur
          </button>
        </div>
      </div>

      {/* Liste des matchs */}
      <div className="space-y-3">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun match ne correspond aux filtres sélectionnés
          </div>
        ) : (
          filteredMatches.map((match) => (
            <div 
              key={match.id} 
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Résultat */}
              <div className="flex-shrink-0">
                {getResultBadge(match)}
              </div>

              {/* Date */}
              <div className="flex-shrink-0 w-24">
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(match.date)}
                </p>
              </div>

              {/* Lieu */}
              <div className="flex-shrink-0 w-20">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  match.isHome 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {match.isHome ? '🏠 Dom.' : '✈️ Ext.'}
                </span>
              </div>

              {/* Adversaire */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  vs {match.opponent}
                </p>
                {match.competition && (
                  <p className="text-xs text-gray-500 truncate">{match.competition}</p>
                )}
              </div>

              {/* Score */}
              <div className="flex-shrink-0">
                <div className={`text-lg font-bold ${
                  match.scoreTeam > match.scoreOpponent ? 'text-green-600' : 
                  match.scoreTeam < match.scoreOpponent ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {match.scoreTeam} - {match.scoreOpponent}
                </div>
              </div>

              {/* Lieu du match */}
              {match.location && (
                <div className="flex-shrink-0 hidden md:block">
                  <p className="text-xs text-gray-500 max-w-xs truncate">
                    📍 {match.location}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default MatchesTable;