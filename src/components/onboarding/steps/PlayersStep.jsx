// src/components/onboarding/steps/PlayersStep.jsx
import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/ui';

/**
 * Étape 3 : Ajout des joueurs
 * @param {object} props - Props du composant
 * @param {object} props.data - Données accumulées du wizard
 * @param {function} props.onNext - Callback pour passer à l'étape suivante
 * @param {function} props.onBack - Callback pour revenir en arrière
 * @param {function} props.onSkip - Callback pour passer cette étape
 */
export const PlayersStep = ({ data, onNext, onBack, onSkip }) => {
  const [players, setPlayers] = useState(data?.players || []);
  const [showForm, setShowForm] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState({
    name: '',
    position: '',
    jerseyNumber: '',
  });
  const [errors, setErrors] = useState({});

  // Positions pour Rugby (adapter selon le sport)
  const positions = [
    { value: 'pilier', label: 'Pilier' },
    { value: 'talonneur', label: 'Talonneur' },
    { value: 'deuxieme-ligne', label: 'Deuxième ligne' },
    { value: 'troisieme-ligne', label: 'Troisième ligne' },
    { value: 'demi-melee', label: 'Demi de mêlée' },
    { value: 'demi-ouverture', label: "Demi d'ouverture" },
    { value: 'centre', label: 'Centre' },
    { value: 'ailier', label: 'Ailier' },
    { value: 'arriere', label: 'Arrière' },
  ];

  const validatePlayer = () => {
    const newErrors = {};
    if (!currentPlayer.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addPlayer = () => {
    if (validatePlayer()) {
      setPlayers([...players, { ...currentPlayer, id: Date.now() }]);
      setCurrentPlayer({ name: '', position: '', jerseyNumber: '' });
      setShowForm(false);
      setErrors({});
    }
  };

  const removePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleNext = () => {
    onNext({ players });
  };

  return (
    <div>
      {/* Header */}
      <h2 className="text-2xl font-bold mb-2">Ajoutez vos premiers joueurs</h2>
      <p className="text-gray-600 mb-6">
        Vous pouvez ajouter des joueurs maintenant ou le faire plus tard
      </p>

      {/* Liste des joueurs ajoutés */}
      {players.length > 0 && (
        <div className="mb-6 space-y-2">
          {players.map(player => (
            <div 
              key={player.id} 
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  {player.jerseyNumber || '?'}
                </div>
                <div>
                  <span className="font-medium block">{player.name}</span>
                  {player.position && (
                    <span className="text-sm text-gray-600 capitalize">
                      {player.position.replace('-', ' ')}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => removePlayer(player.id)}
                className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                title="Retirer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire d'ajout */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all mb-6"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium">Ajouter un joueur</span>
          </div>
        </button>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50">
          <h3 className="font-semibold mb-4">Nouveau joueur</h3>
          
          <Input
            label="Nom du joueur"
            placeholder="Ex: Jean Dupont"
            value={currentPlayer.name}
            onChange={(e) => {
              setCurrentPlayer({ ...currentPlayer, name: e.target.value });
              if (errors.name) setErrors({});
            }}
            error={errors.name}
            required
          />
          
          <Select
            label="Position (optionnel)"
            options={positions}
            value={currentPlayer.position}
            onChange={(e) => setCurrentPlayer({ ...currentPlayer, position: e.target.value })}
          />
          
          <Input
            label="Numéro de maillot (optionnel)"
            type="number"
            placeholder="Ex: 10"
            value={currentPlayer.jerseyNumber}
            onChange={(e) => setCurrentPlayer({ ...currentPlayer, jerseyNumber: e.target.value })}
            min="1"
            max="99"
          />
          
          <div className="flex space-x-2 mt-2">
            <Button type="button" onClick={addPlayer} className="flex-1">
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Ajouter
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => {
                setShowForm(false);
                setCurrentPlayer({ name: '', position: '', jerseyNumber: '' });
                setErrors({});
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-blue-700">
          💡 <strong>Astuce :</strong> Vous avez ajouté <strong>{players.length}</strong> joueur(s). 
          Vous pourrez en ajouter plus tard depuis le dashboard !
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          ← Retour
        </Button>
        <div className="space-x-2">
          <Button type="button" variant="secondary" onClick={onSkip}>
            Passer
          </Button>
          <Button type="button" onClick={handleNext}>
            Suivant →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayersStep;