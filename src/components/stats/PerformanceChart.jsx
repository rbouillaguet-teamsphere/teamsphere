import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const PerformanceChart = ({ matches }) => {
  const chartData = useMemo(() => {
    if (!matches || matches.length === 0) return [];

    // Trier les matchs par date
    const sortedMatches = [...matches].sort((a, b) => 
      a.date?.toMillis() - b.date?.toMillis()
    );

    // Créer les données pour le graphique
    return sortedMatches.map((match, index) => {
      const result = match.scoreTeam > match.scoreOpponent ? 'win' : 
                     match.scoreTeam < match.scoreOpponent ? 'loss' : 'draw';
      
      const points = result === 'win' ? 3 : result === 'draw' ? 1 : 0;

      // Formater la date
      const date = match.date?.toDate();
      const dateStr = date ? 
        `${date.getDate()}/${date.getMonth() + 1}` : 
        `Match ${index + 1}`;

      return {
        name: dateStr,
        points: points,
        goalsScored: match.scoreTeam || 0,
        goalsConceded: match.scoreOpponent || 0,
        opponent: match.opponent,
        result: result,
        fullDate: date ? date.toLocaleDateString('fr-FR') : ''
      };
    });
  }, [matches]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.fullDate}</p>
          <p className="text-sm text-gray-600 mb-2">vs {data.opponent}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Score:</span>{' '}
              <span className={data.result === 'win' ? 'text-green-600 font-semibold' : 
                              data.result === 'loss' ? 'text-red-600 font-semibold' : 
                              'text-gray-600 font-semibold'}>
                {data.goalsScored} - {data.goalsConceded}
              </span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Points:</span> {data.points}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Évolution des performances</h2>
        <p className="text-sm text-gray-600 mt-1">
          Points par match (Victoire: 3pts, Nul: 1pt, Défaite: 0pt)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis 
            domain={[0, 3]}
            ticks={[0, 1, 2, 3]}
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="points"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorPoints)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Graphique des buts */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Buts marqués vs encaissés</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="goalsScored"
              stroke="#10b981"
              strokeWidth={2}
              name="Buts marqués"
              dot={{ fill: '#10b981', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="goalsConceded"
              stroke="#ef4444"
              strokeWidth={2}
              name="Buts encaissés"
              dot={{ fill: '#ef4444', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PerformanceChart;