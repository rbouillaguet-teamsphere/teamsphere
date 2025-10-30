import React from 'react';
import { Card } from '../ui/Card';

const StatsOverview = ({ stats }) => {
  const statCards = [
    {
      label: 'Matchs joués',
      value: stats.matchesPlayed,
      icon: '🏆',
      color: 'blue'
    },
    {
      label: 'Victoires',
      value: stats.wins,
      subtitle: `${stats.winRate}%`,
      icon: '✅',
      color: 'green'
    },
    {
      label: 'Nuls',
      value: stats.draws,
      icon: '➖',
      color: 'gray'
    },
    {
      label: 'Défaites',
      value: stats.losses,
      icon: '❌',
      color: 'red'
    },
    {
      label: 'Buts marqués',
      value: stats.goalsScored,
      icon: '⚽',
      color: 'blue'
    },
    {
      label: 'Buts encaissés',
      value: stats.goalsConceded,
      icon: '🥅',
      color: 'orange'
    },
    {
      label: 'Différence de buts',
      value: stats.goalDifference > 0 ? `+${stats.goalDifference}` : stats.goalDifference,
      icon: '📊',
      color: stats.goalDifference > 0 ? 'green' : stats.goalDifference < 0 ? 'red' : 'gray'
    },
    {
      label: 'Série actuelle',
      value: stats.currentStreak.count > 0 ? stats.currentStreak.count : '-',
      subtitle: getStreakLabel(stats.currentStreak),
      icon: getStreakIcon(stats.currentStreak),
      color: getStreakColor(stats.currentStreak)
    }
  ];

  function getStreakLabel(streak) {
    if (streak.count === 0) return '';
    if (streak.type === 'win') return 'victoires';
    if (streak.type === 'loss') return 'défaites';
    if (streak.type === 'draw') return 'nuls';
    return '';
  }

  function getStreakIcon(streak) {
    if (streak.type === 'win') return '🔥';
    if (streak.type === 'loss') return '❄️';
    if (streak.type === 'draw') return '➖';
    return '📊';
  }

  function getStreakColor(streak) {
    if (streak.type === 'win') return 'green';
    if (streak.type === 'loss') return 'red';
    return 'gray';
  }

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    gray: 'bg-gray-50 text-gray-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
              )}
            </div>
            <div className={`w-12 h-12 rounded-lg ${colorClasses[stat.color]} flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;