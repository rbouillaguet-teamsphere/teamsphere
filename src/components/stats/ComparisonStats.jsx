import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ComparisonStats = ({ matches, homeWins, awayWins }) => {
  const comparisonData = useMemo(() => {
    const homeMatches = matches.filter(m => m.isHome);
    const awayMatches = matches.filter(m => !m.isHome);

    const homeStats = {
      played: homeMatches.length,
      wins: homeMatches.filter(m => m.scoreTeam > m.scoreOpponent).length,
      draws: homeMatches.filter(m => m.scoreTeam === m.scoreOpponent).length,
      losses: homeMatches.filter(m => m.scoreTeam < m.scoreOpponent).length,
      goalsScored: homeMatches.reduce((sum, m) => sum + (m.scoreTeam || 0), 0),
      goalsConceded: homeMatches.reduce((sum, m) => sum + (m.scoreOpponent || 0), 0)
    };

    const awayStats = {
      played: awayMatches.length,
      wins: awayMatches.filter(m => m.scoreTeam > m.scoreOpponent).length,
      draws: awayMatches.filter(m => m.scoreTeam === m.scoreOpponent).length,
      losses: awayMatches.filter(m => m.scoreTeam < m.scoreOpponent).length,
      goalsScored: awayMatches.reduce((sum, m) => sum + (m.scoreTeam || 0), 0),
      goalsConceded: awayMatches.reduce((sum, m) => sum + (m.scoreOpponent || 0), 0)
    };

    return { homeStats, awayStats };
  }, [matches]);

  const chartData = [
    {
      name: 'Victoires',
      domicile: comparisonData.homeStats.wins,
      exterieur: comparisonData.awayStats.wins
    },
    {
      name: 'Nuls',
      domicile: comparisonData.homeStats.draws,
      exterieur: comparisonData.awayStats.draws
    },
    {
      name: 'Défaites',
      domicile: comparisonData.homeStats.losses,
      exterieur: comparisonData.awayStats.losses
    },
    {
      name: 'Buts marqués',
      domicile: comparisonData.homeStats.goalsScored,
      exterieur: comparisonData.awayStats.goalsScored
    }
  ];

  const { homeStats, awayStats } = comparisonData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Statistiques Domicile */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🏠 À domicile</h3>
          <span className="text-sm text-gray-500">{homeStats.played} matchs</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Victoires</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all" 
                  style={{ 
                    width: `${homeStats.played > 0 ? (homeStats.wins / homeStats.played) * 100 : 0}%` 
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-green-600 w-12 text-right">
                {homeStats.wins}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Nuls</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-500 h-2 rounded-full transition-all" 
                  style={{ 
                    width: `${homeStats.played > 0 ? (homeStats.draws / homeStats.played) * 100 : 0}%` 
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-600 w-12 text-right">
                {homeStats.draws}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Défaites</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all" 
                  style={{ 
                    width: `${homeStats.played > 0 ? (homeStats.losses / homeStats.played) * 100 : 0}%` 
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-red-600 w-12 text-right">
                {homeStats.losses}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Buts marqués</span>
              <span className="font-semibold text-blue-600">{homeStats.goalsScored}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Buts encaissés</span>
              <span className="font-semibold text-orange-600">{homeStats.goalsConceded}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Différence</span>
              <span className={`font-semibold ${
                (homeStats.goalsScored - homeStats.goalsConceded) > 0 ? 'text-green-600' : 
                (homeStats.goalsScored - homeStats.goalsConceded) < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {homeStats.goalsScored - homeStats.goalsConceded > 0 ? '+' : ''}
                {homeStats.goalsScored - homeStats.goalsConceded}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistiques Extérieur */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">✈️ À l'extérieur</h3>
          <span className="text-sm text-gray-500">{awayStats.played} matchs</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Victoires</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all" 
                  style={{ 
                    width: `${awayStats.played > 0 ? (awayStats.wins / awayStats.played) * 100 : 0}%` 
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-green-600 w-12 text-right">
                {awayStats.wins}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Nuls</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-500 h-2 rounded-full transition-all" 
                  style={{ 
                    width: `${awayStats.played > 0 ? (awayStats.draws / awayStats.played) * 100 : 0}%` 
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-600 w-12 text-right">
                {awayStats.draws}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Défaites</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all" 
                  style={{ 
                    width: `${awayStats.played > 0 ? (awayStats.losses / awayStats.played) * 100 : 0}%` 
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-red-600 w-12 text-right">
                {awayStats.losses}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Buts marqués</span>
              <span className="font-semibold text-blue-600">{awayStats.goalsScored}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Buts encaissés</span>
              <span className="font-semibold text-orange-600">{awayStats.goalsConceded}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Différence</span>
              <span className={`font-semibold ${
                (awayStats.goalsScored - awayStats.goalsConceded) > 0 ? 'text-green-600' : 
                (awayStats.goalsScored - awayStats.goalsConceded) < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {awayStats.goalsScored - awayStats.goalsConceded > 0 ? '+' : ''}
                {awayStats.goalsScored - awayStats.goalsConceded}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Graphique de comparaison */}
      <Card className="p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparaison domicile / extérieur</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="domicile" fill="#3b82f6" name="Domicile" radius={[8, 8, 0, 0]} />
            <Bar dataKey="exterieur" fill="#8b5cf6" name="Extérieur" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default ComparisonStats;