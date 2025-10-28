import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { matchService } from '../../services/matchService';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';

export default function NextMatchWidget() {
  const { selectedTeamId, userData } = useApp();
  const [nextMatch, setNextMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNextMatch();
  }, [selectedTeamId]);

  async function loadNextMatch() {
    if (!selectedTeamId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const clubId = userData?.memberships?.[0]?.clubId;
      const upcomingMatches = await matchService.getUpcomingMatches(clubId, selectedTeamId, 1);
      
      if (upcomingMatches.length > 0) {
        setNextMatch(upcomingMatches[0]);
      } else {
        setNextMatch(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du prochain match:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function getTimeUntilMatch(matchDate) {
    const now = new Date();
    const match = matchDate.toDate?.() || matchDate;
    const diff = match - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `Dans ${days} jour${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `Dans ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      return 'Bientôt';
    }
  }

  function formatDate(date) {
    const d = date.toDate?.() || date;
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  if (!nextMatch) {
    return (
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Aucun match prévu</h3>
          <p className="text-xs text-gray-500 mb-4">
            Planifiez votre prochain match
          </p>
          <Link 
            to="/calendrier" 
            className="inline-block px-4 py-2 bg-white text-sm font-medium text-gray-700 
                       rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Voir le calendrier
          </Link>
        </div>
      </Card>
    );
  }

  const matchDate = nextMatch.date.toDate?.() || nextMatch.date;
  const countdown = getTimeUntilMatch(nextMatch.date);
  const isToday = new Date().toDateString() === matchDate.toDateString();

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 overflow-hidden relative">
      {/* Badge "Prochain match" */}
      <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
        {isToday ? '🔥 AUJOURD\'HUI' : 'PROCHAIN MATCH'}
      </div>

      {/* Countdown */}
      <div className="mb-4">
        <div className="text-sm text-indigo-600 font-medium mb-1">
          {countdown}
        </div>
        <div className="text-xs text-gray-600">
          {formatDate(matchDate)}
        </div>
      </div>

      {/* Match info */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            nextMatch.isHome 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {nextMatch.isHome ? '🏠 Domicile' : '✈️ Extérieur'}
          </span>
          {nextMatch.competition && (
            <span className="text-xs text-gray-600">
              {nextMatch.competition}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Équipe */}
          <div className="text-center flex-1">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-1 shadow-sm">
              <span className="text-lg font-bold text-gray-700">⚽</span>
            </div>
            <div className="text-xs font-medium text-gray-700">Nous</div>
          </div>

          {/* VS */}
          <div className="text-lg font-bold text-gray-400">VS</div>

          {/* Adversaire */}
          <div className="text-center flex-1">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-1 shadow-sm">
              <span className="text-lg font-bold text-gray-700">🎯</span>
            </div>
            <div className="text-xs font-medium text-gray-700 truncate px-1">
              {nextMatch.opponent}
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      {nextMatch.location && (
        <div className="text-xs text-gray-600 mb-4 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{nextMatch.location}</span>
        </div>
      )}

      {/* Action */}
      <Link 
        to="/calendrier" 
        className="block w-full text-center px-4 py-2 bg-indigo-600 text-white text-sm 
                   font-medium rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Voir tous les matchs →
      </Link>

      {/* Decorative elements */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-200 rounded-full opacity-20"></div>
      <div className="absolute -top-4 -left-4 w-20 h-20 bg-purple-200 rounded-full opacity-20"></div>
    </Card>
  );
}