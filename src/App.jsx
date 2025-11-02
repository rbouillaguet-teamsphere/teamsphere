// src/App.jsx
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useEffect } from 'react';
import { platform } from '@/utils/platform';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { keyboardUtils } from '@/utils/keyboard';
import { backButtonHandler } from '@/utils/backButton';

// ============================================
// 🎨 COMPOSANTS COMMUNS
// ============================================

function Button({ onClick, children, variant = 'primary', size = 'md', icon, disabled, type = 'button', className = '' }) {
  const baseStyles = "rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

function Card({ title, children, actions, className = "", onClick }) {
  return (
    <div 
      className={`bg-white rounded-xl shadow-md p-5 ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className="flex justify-between items-center mb-4 pb-3 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

function Badge({ children, variant = 'default' }) {
  const variants = {
    default: "bg-gray-200 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    admin: "bg-purple-100 text-purple-800",
    coach: "bg-blue-100 text-blue-800"
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function Input({ label, error, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// ============================================
// 🔐 COMPOSANTS AUTH
// ============================================

function LoginForm() {
  const { login } = useApp();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setError('Email ou mot de passe incorrect');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <span className="text-4xl">🏉</span>
            TeamSphere
          </h1>
          <p className="text-gray-600 mt-2">Connexion à votre compte</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre.email@example.com"
            required
          />

          <Input
            type="password"
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Pas encore de compte ?{' '}
            <button className="text-blue-600 hover:underline font-medium">
              S'inscrire
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}

// ============================================
// 📊 COMPOSANTS LAYOUT
// ============================================

function Sidebar() {
  const { currentView, setCurrentView, sidebarOpen, selectedClub, teams, selectedTeamId, setSelectedTeamId } = useApp();

  const menuItems = [
    { id: 'dashboard', icon: '🏠', label: 'Accueil' },
    { id: 'players', icon: '👥', label: 'Joueurs' },
    { id: 'calendar', icon: '📅', label: 'Calendrier' },
    { id: 'stats', icon: '📊', label: 'Statistiques' },
  ];

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      {/* Club header */}
      <div className="p-6 border-b border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
            🏉
          </div>
          <h2 className="font-bold text-lg">{selectedClub?.name || 'TeamSphere'}</h2>
          {selectedClub && (
            <p className="text-sm text-gray-400 mt-1">{selectedClub.sport}</p>
          )}
        </div>
      </div>

      {/* Team selector */}
      {teams.length > 0 && (
        <div className="p-4 border-b border-gray-700">
          <label className="text-xs text-gray-400 uppercase tracking-wide block mb-2">
            Équipe
          </label>
          <select
            value={selectedTeamId || ''}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors text-left">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            👤
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">Mon compte</p>
            <p className="text-xs text-gray-400">Paramètres</p>
          </div>
        </button>
      </div>
    </aside>
  );
}

function Topbar() {
  const { toggleSidebar, currentUser, logout, showClubSwitcher, setShowClubSwitcher } = useApp();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-2xl">☰</span>
        </button>
        <h1 className="text-xl font-bold text-gray-800">TeamSphere</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowClubSwitcher(true)}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Changer de club
        </button>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}

function ClubSwitcher() {
  const { clubs, selectClub, showClubSwitcher, setShowClubSwitcher } = useApp();

  if (!showClubSwitcher) return null;

  return (
    <Modal
      isOpen={showClubSwitcher}
      onClose={() => setShowClubSwitcher(false)}
      title="Choisir un club"
    >
      <div className="space-y-3">
        {clubs.map(club => (
          <button
            key={club.id}
            onClick={() => {
              selectClub(club.id);
              setShowClubSwitcher(false);
            }}
            className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-2xl">
                🏉
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{club.name}</h3>
                <p className="text-sm text-gray-600">{club.sport} • {club.city}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}

function PlayerModal() {
  const {
    showPlayerModal,
    setShowPlayerModal,
    editingPlayer,
    setEditingPlayer,
    addPlayer,
    updatePlayer,
    selectedTeamId
  } = useApp();

  const [formData, setFormData] = React.useState({
    name: '',
    position: '',
    jerseyNumber: ''
  });

  React.useEffect(() => {
    if (editingPlayer) {
      setFormData(editingPlayer);
    } else {
      setFormData({ name: '', position: '', jerseyNumber: '' });
    }
  }, [editingPlayer, showPlayerModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingPlayer) {
      await updatePlayer(editingPlayer.id, formData);
    } else {
      await addPlayer({
        ...formData,
        teamId: selectedTeamId
      });
    }
    
    setShowPlayerModal(false);
    setEditingPlayer(null);
  };

  const handleClose = () => {
    setShowPlayerModal(false);
    setEditingPlayer(null);
  };

  return (
    <Modal
      isOpen={showPlayerModal}
      onClose={handleClose}
      title={editingPlayer ? 'Modifier le joueur' : 'Ajouter un joueur'}
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Nom complet"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Jean Dupont"
          required
        />

        <Input
          label="Position"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          placeholder="Pilier"
        />

        <Input
          label="Numéro de maillot"
          type="number"
          value={formData.jerseyNumber}
          onChange={(e) => setFormData({ ...formData, jerseyNumber: e.target.value })}
          placeholder="10"
        />

        <div className="flex gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
            Annuler
          </Button>
          <Button type="submit" className="flex-1">
            {editingPlayer ? 'Modifier' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ============================================
// 📄 PAGES
// ============================================

function DashboardPage() {
  const { selectedTeam, players, matches, selectedClub } = useApp();

  const stats = {
    totalPlayers: players.length,
    activePlayers: players.filter(p => p.status === 'active').length,
    upcomingMatches: matches.filter(m => m.status === 'upcoming').length,
    recentMatches: matches.filter(m => m.status === 'finished').slice(0, 3)
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">{selectedTeam?.name} • {selectedClub?.name}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-3xl font-bold text-blue-600">{stats.totalPlayers}</p>
          <p className="text-sm text-gray-600 mt-1">Joueurs</p>
          <p className="text-xs text-gray-500 mt-1">{stats.activePlayers} actifs</p>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-3xl font-bold text-green-600">{stats.upcomingMatches}</p>
          <p className="text-sm text-gray-600 mt-1">Matchs à venir</p>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-3">🏉</div>
          <p className="text-3xl font-bold text-purple-600">{matches.length}</p>
          <p className="text-sm text-gray-600 mt-1">Total saison</p>
        </Card>
      </div>

      {/* Recent matches */}
      {stats.recentMatches.length > 0 && (
        <Card title="Derniers matchs">
          <div className="space-y-3">
            {stats.recentMatches.map(match => (
              <div key={match.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{match.opponent}</p>
                  <p className="text-sm text-gray-600">{match.date}</p>
                </div>
                {match.scoreHome !== null && (
                  <div className="text-xl font-bold text-blue-600">
                    {match.scoreHome} - {match.scoreAway}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick actions */}
      <Card title="Actions rapides">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="primary">➕ Nouveau match</Button>
          <Button variant="secondary">👥 Nouveau joueur</Button>
        </div>
      </Card>
    </div>
  );
}

function PlayersPage() {
  const { players, setShowPlayerModal, setEditingPlayer, deletePlayer, hasPermission } = useApp();

  const canWrite = hasPermission('write');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Joueurs</h1>
          <p className="text-gray-600 mt-1">{players.length} joueur(s)</p>
        </div>
        {canWrite && (
          <Button onClick={() => setShowPlayerModal(true)}>
            ➕ Ajouter un joueur
          </Button>
        )}
      </div>

      {players.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Aucun joueur
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par ajouter vos premiers joueurs
            </p>
            {canWrite && (
              <Button onClick={() => setShowPlayerModal(true)}>
                ➕ Ajouter un joueur
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map(player => (
            <Card key={player.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{player.name}</h3>
                    {player.position && (
                      <p className="text-sm text-gray-600">{player.position}</p>
                    )}
                  </div>
                </div>
                {player.jerseyNumber && (
                  <Badge variant="info">#{player.jerseyNumber}</Badge>
                )}
              </div>

              {canWrite && (
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEditingPlayer(player);
                      setShowPlayerModal(true);
                    }}
                    className="flex-1"
                  >
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      if (confirm(`Supprimer ${player.name} ?`)) {
                        deletePlayer(player.id);
                      }
                    }}
                    className="flex-1"
                  >
                    Supprimer
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CalendarPage() {
  const { matches, hasPermission } = useApp();
  const [showAddModal, setShowAddModal] = React.useState(false);

  const upcomingMatches = matches.filter(m => m.status === 'upcoming');
  const pastMatches = matches.filter(m => m.status === 'finished');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Calendrier</h1>
          <p className="text-gray-600 mt-1">{matches.length} match(s)</p>
        </div>
        {hasPermission('write') && (
          <Button onClick={() => setShowAddModal(true)}>
            ➕ Nouveau match
          </Button>
        )}
      </div>

      {/* Matchs à venir */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📅</span>
          Matchs à venir ({upcomingMatches.length})
        </h2>

        {upcomingMatches.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-gray-600">Aucun match prévu</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingMatches.map(match => (
              <Card key={match.id}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {match.opponent}
                  </h3>
                  <Badge variant="info">À venir</Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>📅 {match.date}</p>
                  {match.location && <p>📍 {match.location}</p>}
                  {match.competition && <p>🏆 {match.competition}</p>}
                </div>
                {hasPermission('write') && (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="secondary" className="flex-1">
                      Modifier
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1">
                      Voir détails
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Matchs passés */}
      {pastMatches.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>✅</span>
            Matchs terminés ({pastMatches.length})
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pastMatches.map(match => (
              <Card key={match.id} className="opacity-75">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {match.opponent}
                  </h3>
                  <Badge variant="default">Terminé</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{match.date}</p>
                {match.scoreHome !== null && match.scoreAway !== null && (
                  <div className="text-2xl font-bold text-center py-2 bg-gray-50 rounded">
                    {match.scoreHome} - {match.scoreAway}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatisticsPage() {
  const { players, matches, selectedTeam } = useApp();

  const totalTries = players.reduce((sum, p) => sum + (p.stats?.tries || 0), 0);
  const totalTackles = players.reduce((sum, p) => sum + (p.stats?.tackles || 0), 0);
  const avgAttendance = Math.round(
    players.reduce((sum, p) => sum + (p.stats?.attendance || 0), 0) / (players.length || 1)
  );

  const topScorers = [...players]
    .sort((a, b) => (b.stats?.tries || 0) - (a.stats?.tries || 0))
    .slice(0, 5);

  const topTacklers = [...players]
    .sort((a, b) => (b.stats?.tackles || 0) - (a.stats?.tackles || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Statistiques</h1>
        <p className="text-gray-600 mt-1">{selectedTeam?.name} • Saison 2024-2025</p>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-4xl mb-2">👥</div>
          <p className="text-3xl font-bold text-blue-600">{players.length}</p>
          <p className="text-sm text-gray-600">Joueurs</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl mb-2">🏉</div>
          <p className="text-3xl font-bold text-green-600">{totalTries}</p>
          <p className="text-sm text-gray-600">Essais marqués</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl mb-2">💪</div>
          <p className="text-3xl font-bold text-purple-600">{totalTackles}</p>
          <p className="text-sm text-gray-600">Placages</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-3xl font-bold text-orange-600">{avgAttendance}%</p>
          <p className="text-sm text-gray-600">Présence moyenne</p>
        </Card>
      </div>

      {/* Top scorers et tacklers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meilleurs marqueurs */}
        <Card title="🏆 Meilleurs marqueurs">
          <div className="space-y-3">
            {topScorers.map((player, index) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{player.name}</p>
                    <p className="text-xs text-gray-500">{player.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{player.stats?.tries || 0}</p>
                  <p className="text-xs text-gray-500">essais</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Meilleurs plaqueurs */}
        <Card title="💪 Meilleurs plaqueurs">
          <div className="space-y-3">
            {topTacklers.map((player, index) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{player.name}</p>
                    <p className="text-xs text-gray-500">{player.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{player.stats?.tackles || 0}</p>
                  <p className="text-xs text-gray-500">placages</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Résumé matchs */}
      <Card title="📅 Résumé de la saison">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{matches.length}</p>
            <p className="text-sm text-gray-600">Total matchs</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {matches.filter(m => m.status === 'upcoming').length}
            </p>
            <p className="text-sm text-gray-600">À venir</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-600">
              {matches.filter(m => m.status === 'finished').length}
            </p>
            <p className="text-sm text-gray-600">Terminés</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============================================
// 🎬 MAIN APP
// ============================================

function AppContent() {
  const { currentUser, loading, authChecked, currentView } = useApp();

  // Loading state
  if (!authChecked || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🏉</div>
          <p className="text-gray-600">Chargement de TeamSphere...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!currentUser) {
    return <LoginForm />;
  }

  // Authenticated - Main app
  const renderView = () => {
    switch (currentView) {
      case 'players':
        return <PlayersPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'stats':
        return <StatisticsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
      <PlayerModal />
      <ClubSwitcher />
    </div>
  );
}

// ============================================
// 🚀 APP AVEC OPTIMISATIONS MOBILE
// ============================================

export default function App() {
  useEffect(() => {
    const initMobileApp = async () => {
      if (platform.isMobile()) {
        try {
          // 1. Configurer la Status Bar
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#2563eb' });
          
          // 2. Initialiser le clavier
          keyboardUtils.init();
          
          // 3. Initialiser le bouton retour Android
          backButtonHandler.init();
          
          // 4. Ajouter classe de plateforme au body
          document.body.classList.add(`platform-${platform.getPlatform()}`);
          
          // 5. Cacher le splash screen après initialisation
          await SplashScreen.hide();
          
          console.log('✅ Mobile app initialized');
          console.log('📱 Platform:', platform.getPlatform());
        } catch (error) {
          console.error('❌ Error initializing mobile app:', error);
        }
      } else {
        console.log('🌐 App running in web browser');
      }
    };
    
    initMobileApp();
    
    // Cleanup
    return () => {
      if (platform.isMobile()) {
        keyboardUtils.cleanup();
        backButtonHandler.cleanup();
      }
    };
  }, []);

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}