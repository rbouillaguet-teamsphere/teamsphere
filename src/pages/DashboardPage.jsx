// src/pages/DashboardPage.jsx
import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout';

export const DashboardPage = () => {
  const { 
    currentUser, 
    userProfile, 
    clubs, 
    selectedClubId,
    teams,
    selectedTeamId,
    players,
    matches
  } = useApp();

  // Trouver le club sélectionné
  const selectedClub = clubs.find(c => c.id === selectedClubId);
  const selectedTeam = teams.find(t => t.id === selectedTeamId);

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard - {selectedClub?.name || 'Chargement...'}
          </h1>
          <p className="text-gray-600">
            Bienvenue {userProfile?.name} !
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Clubs</div>
            <div className="text-3xl font-bold text-blue-600">{clubs.length}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Équipes</div>
            <div className="text-3xl font-bold text-green-600">{teams.length}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Joueurs</div>
            <div className="text-3xl font-bold text-purple-600">{players.length}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Matchs</div>
            <div className="text-3xl font-bold text-orange-600">{matches.length}</div>
          </div>
        </div>

        {/* Équipe Sélectionnée */}
        {selectedTeam && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Équipe : {selectedTeam.name}</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-600">Catégorie : </span>
                <span className="font-medium">{selectedTeam.category}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Genre : </span>
                <span className="font-medium capitalize">{selectedTeam.gender}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Saison : </span>
                <span className="font-medium">{selectedTeam.season}</span>
              </div>
            </div>
          </div>
        )}

        {/* Liste des Joueurs */}
        {players.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Joueurs ({players.length})</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <div key={player.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {player.jerseyNumber || '?'}
                    </div>
                    <div>
                      <div className="font-semibold">{player.name}</div>
                      {player.position && (
                        <div className="text-sm text-gray-600 capitalize">
                          {player.position.replace('-', ' ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message si pas de données */}
        {clubs.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">
              Aucun club trouvé. Avez-vous complété l'onboarding ?
            </p>
          </div>
        )}

      </div>
    </div>
    </DashboardLayout>
  );
};

export default DashboardPage;