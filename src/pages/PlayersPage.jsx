// src/pages/PlayersPage.jsx
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout';

export const PlayersPage = () => {
  const { 
    players,
    selectedClubId,
    selectedTeamId,
    playerService 
  } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    position: '',
    jerseyNumber: '',
  });

  const handleAddPlayer = async () => {
    if (!newPlayer.name.trim()) {
      alert('Le nom est requis');
      return;
    }

    try {
      await playerService.create(selectedClubId, selectedTeamId, {
        name: newPlayer.name,
        position: newPlayer.position,
        jerseyNumber: newPlayer.jerseyNumber ? parseInt(newPlayer.jerseyNumber) : null,
        status: 'active',
      });

      // Réinitialiser le formulaire
      setNewPlayer({ name: '', position: '', jerseyNumber: '' });
      setShowAddForm(false);
      
      alert('Joueur ajouté avec succès !');
    } catch (error) {
      console.error('Erreur ajout joueur:', error);
      alert('Erreur lors de l\'ajout du joueur');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Joueurs
              </h1>
              <p className="text-gray-600">
                Gérez les joueurs de votre équipe
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {showAddForm ? '✕ Annuler' : '➕ Ajouter un joueur'}
            </button>
          </div>

          {/* Formulaire d'ajout */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Nouveau joueur</h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={newPlayer.name}
                    onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                    placeholder="Ex: Jean Dupont"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <select
                    value={newPlayer.position}
                    onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="pilier">Pilier</option>
                    <option value="talonneur">Talonneur</option>
                    <option value="deuxieme-ligne">Deuxième ligne</option>
                    <option value="troisieme-ligne">Troisième ligne</option>
                    <option value="demi-melee">Demi de mêlée</option>
                    <option value="demi-ouverture">Demi d'ouverture</option>
                    <option value="centre">Centre</option>
                    <option value="ailier">Ailier</option>
                    <option value="arriere">Arrière</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de maillot
                  </label>
                  <input
                    type="number"
                    value={newPlayer.jerseyNumber}
                    onChange={(e) => setNewPlayer({ ...newPlayer, jerseyNumber: e.target.value })}
                    placeholder="Ex: 10"
                    min="1"
                    max="99"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handleAddPlayer}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                ✓ Ajouter le joueur
              </button>
            </div>
          )}

          {/* Liste des joueurs */}
          {players.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {players.map((player) => (
                <div key={player.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                      {player.jerseyNumber || '?'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{player.name}</h3>
                      {player.position && (
                        <p className="text-sm text-gray-600 capitalize mb-2">
                          {player.position.replace('-', ' ')}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                          Actif
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun joueur
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez par ajouter votre premier joueur
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                ➕ Ajouter un joueur
              </button>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlayersPage;