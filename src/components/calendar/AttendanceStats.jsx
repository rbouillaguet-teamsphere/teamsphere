import { useState, useEffect, useMemo } from 'react';
import { attendanceService, eventService } from '@/services/firebase';
import { useApp } from '@/context/AppContext';
import Button from '../ui/Button';

export default function AttendanceStats({ players = [] }) {
  const { selectedClubId, selectedTeamId } = useApp();
  const [attendances, setAttendances] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // all, month, week
  const [selectedType, setSelectedType] = useState('all'); // all, training, match

  useEffect(() => {
    loadData();
  }, [selectedClubId, selectedTeamId]);

  async function loadData() {
    try {
      setIsLoading(true);
      
      // Charger tous les événements
      const eventsData = await eventService.getTeamEvents(selectedClubId, selectedTeamId);
      setEvents(eventsData);
      
      // Charger toutes les présences
      const attendancesRef = [];
      for (const event of eventsData) {
        const eventAttendances = await attendanceService.getEventAttendances(
          selectedClubId,
          selectedTeamId,
          event.id
        );
        attendancesRef.push(...eventAttendances.map(a => ({ ...a, eventId: event.id })));
      }
      setAttendances(attendancesRef);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Filtrer les données selon la période et le type
  const filteredData = useMemo(() => {
    let filtered = [...attendances];
    const now = new Date();
    
    // Filtre par période
    if (selectedPeriod === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(a => {
        const event = events.find(e => e.id === a.eventId);
        const eventDate = event?.date?.toDate?.() || new Date(event?.date);
        return eventDate >= monthAgo;
      });
    } else if (selectedPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(a => {
        const event = events.find(e => e.id === a.eventId);
        const eventDate = event?.date?.toDate?.() || new Date(event?.date);
        return eventDate >= weekAgo;
      });
    }
    
    // Filtre par type d'événement
    if (selectedType !== 'all') {
      filtered = filtered.filter(a => {
        const event = events.find(e => e.id === a.eventId);
        return event?.type === selectedType;
      });
    }
    
    return filtered;
  }, [attendances, events, selectedPeriod, selectedType]);

  // Calculer les statistiques par joueur
  const playerStats = useMemo(() => {
    return players.map(player => {
      const playerAttendances = filteredData.filter(a => a.playerId === player.id);
      const total = playerAttendances.length;
      const present = playerAttendances.filter(a => a.present).length;
      const absent = total - present;
      const rate = total > 0 ? (present / total) * 100 : 0;
      
      return {
        ...player,
        total,
        present,
        absent,
        rate: Math.round(rate * 10) / 10
      };
    }).sort((a, b) => b.rate - a.rate); // Trier par taux décroissant
  }, [players, filteredData]);

  // Statistiques globales
  const globalStats = useMemo(() => {
    const total = filteredData.length;
    const present = filteredData.filter(a => a.present).length;
    const absent = total - present;
    const rate = total > 0 ? (present / total) * 100 : 0;
    
    return {
      total,
      present,
      absent,
      rate: Math.round(rate * 10) / 10
    };
  }, [filteredData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des statistiques...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec filtres */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">📊 Statistiques de présence</h2>
        
        <div className="flex gap-3">
          {/* Filtre période */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toute la saison</option>
            <option value="month">30 derniers jours</option>
            <option value="week">7 derniers jours</option>
          </select>
          
          {/* Filtre type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les événements</option>
            <option value="training">Entraînements</option>
            <option value="match">Matchs</option>
            <option value="meeting">Réunions</option>
          </select>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="text-sm text-gray-500 mb-2">Événements totaux</div>
          <div className="text-3xl font-bold text-gray-900">{globalStats.total}</div>
        </div>
        
        <div className="bg-green-50 rounded-2xl shadow-sm border border-green-100 p-6">
          <div className="text-sm text-green-600 mb-2">Présences</div>
          <div className="text-3xl font-bold text-green-700">{globalStats.present}</div>
        </div>
        
        <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-6">
          <div className="text-sm text-red-600 mb-2">Absences</div>
          <div className="text-3xl font-bold text-red-700">{globalStats.absent}</div>
        </div>
        
        <div className="bg-blue-50 rounded-2xl shadow-sm border border-blue-100 p-6">
          <div className="text-sm text-blue-600 mb-2">Taux moyen</div>
          <div className="text-3xl font-bold text-blue-700">{globalStats.rate}%</div>
        </div>
      </div>

      {/* Tableau des joueurs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Détails par joueur</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joueur
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Présent
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taux
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {playerStats.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    Aucune donnée de présence disponible
                  </td>
                </tr>
              ) : (
                playerStats.map((player, index) => (
                  <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index === 0 && <span className="text-xl mr-2">🥇</span>}
                        {index === 1 && <span className="text-xl mr-2">🥈</span>}
                        {index === 2 && <span className="text-xl mr-2">🥉</span>}
                        <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {player.firstName} {player.lastName}
                      </div>
                      {player.position && (
                        <div className="text-sm text-gray-500">{player.position}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-900">{player.total}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {player.present}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {player.absent}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              player.rate >= 80 ? 'bg-green-500' :
                              player.rate >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${player.rate}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {player.rate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Légende */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Interprétation des taux :</p>
            <ul className="space-y-1">
              <li>• <span className="font-semibold text-green-600">≥ 80%</span> : Très assidu</li>
              <li>• <span className="font-semibold text-yellow-600">60-79%</span> : Assidu</li>
              <li>• <span className="font-semibold text-red-600">{'<'} 60%</span> : À surveiller</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
