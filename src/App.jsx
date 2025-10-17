// src/App.jsx
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';

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
    <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col shadow-xl">
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-3xl">{selectedClub?.logo || '🏉'}</span>
          <span>TeamSphere</span>
        </h1>
        <p className="text-blue-200 text-sm mt-1">{selectedClub?.name || 'Chargement...'}</p>
      </div>

      {teams.length > 0 && (
        <div className="p-4 border-b border-blue-700">
          <label className="text-xs text-blue-200 uppercase font-semibold mb-2 block">Équipe</label>
          <select
            value={selectedTeamId || ''}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="w-full bg-blue-700 text-white rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
              currentView === item.id
                ? 'bg-blue-600 shadow-md'
                : 'hover:bg-blue-700/50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-700">
        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-700/50 transition-all">
          <span className="text-xl">⚙️</span>
          <span className="font-medium">Paramètres</span>
        </button>
      </div>
    </aside>
  );
}

function Topbar() {
  const { selectedClub, selectedTeam, currentUser, userMembership, sidebarOpen, setSidebarOpen, setShowClubSwitcher, logout } = useApp();

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-800 text-2xl"
          >
            ☰
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-800">{selectedTeam?.name || 'TeamSphere'}</h2>
              {userMembership && (
                <Badge variant={userMembership.role === 'admin' ? 'admin' : 'coach'}>
                  {userMembership.role === 'admin' ? 'Admin' : 'Coach'}
                </Badge>
              )}
            </div>
            {selectedClub && (
              <p className="text-sm text-gray-500">{selectedClub.name} • {selectedClub.sport}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowClubSwitcher(true)}
            icon={selectedClub?.logo || '🏉'}
          >
            Changer de club
          </Button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{currentUser?.email || 'Utilisateur'}</p>
              <button 
                onClick={logout}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Déconnexion
              </button>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {currentUser?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ============================================
// 🎯 COMPOSANTS FEATURES
// ============================================

function StatsPanel() {
  const { players, matches } = useApp();

  const stats = [
    { 
      label: 'Joueurs actifs', 
      value: players.filter(p => p.status === 'active').length, 
      icon: '👥', 
      color: 'blue' 
    },
    { 
      label: 'Matchs à venir', 
      value: matches.filter(m => m.status === 'upcoming').length, 
      icon: '🏉', 
      color: 'green' 
    },
    { 
      label: 'Présence moyenne', 
      value: `${Math.round(players.reduce((acc, p) => acc + (p.stats?.attendance || 0), 0) / (players.length || 1))}%`, 
      icon: '📊', 
      color: 'yellow' 
    },
    { 
      label: 'Total joueurs', 
      value: players.length, 
      icon: '👤', 
      color: 'purple' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="text-4xl p-3 bg-gray-100 rounded-lg">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function PlayersList() {
  const { players, setSelectedPlayer, hasPermission } = useApp();

  return (
    <Card 
      title="Liste des joueurs" 
      actions={
        hasPermission('write') && (
          <Button size="sm" icon="➕">Ajouter</Button>
        )
      }
      className="h-full"
    >
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {players.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-2">👥</p>
            <p>Aucun joueur dans cette équipe</p>
            {hasPermission('write') && (
              <Button variant="secondary" size="sm" className="mt-4">
                Ajouter le premier joueur
              </Button>
            )}
          </div>
        ) : (
          players.map(player => (
            <div
              key={player.id}
              onClick={() => setSelectedPlayer(player)}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {player.name?.split(' ').map(n => n[0]).join('') || '??'}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{player.name}</p>
                  <p className="text-sm text-gray-500">{player.position}</p>
                </div>
              </div>
              <Badge variant={player.status === 'active' ? 'success' : 'warning'}>
                {player.status === 'active' ? 'Actif' : 'Blessé'}
              </Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

function PlayerModal() {
  const { selectedPlayer, setSelectedPlayer, hasPermission } = useApp();

  if (!selectedPlayer) return null;

  return (
    <Modal
      isOpen={!!selectedPlayer}
      onClose={() => setSelectedPlayer(null)}
      title={selectedPlayer.name}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {selectedPlayer.name?.split(' ').map(n => n[0]).join('') || '??'}
          </div>
          <div>
            <p className="font-semibold text-lg">{selectedPlayer.position}</p>
            <Badge variant={selectedPlayer.status === 'active' ? 'success' : 'warning'}>
              {selectedPlayer.status === 'active' ? 'Actif' : 'Blessé'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Essais</p>
            <p className="text-2xl font-bold text-blue-600">{selectedPlayer.stats?.tries || 0}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Placages</p>
            <p className="text-2xl font-bold text-green-600">{selectedPlayer.stats?.tackles || 0}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg col-span-2">
            <p className="text-sm text-gray-600">Taux de présence</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: `${selectedPlayer.stats?.attendance || 0}%` }}
                />
              </div>
              <span className="text-xl font-bold">{selectedPlayer.stats?.attendance || 0}%</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          {hasPermission('write') && (
            <Button variant="primary" onClick={() => alert('Modifier - À implémenter')}>
              Modifier
            </Button>
          )}
          <Button variant="secondary" onClick={() => setSelectedPlayer(null)}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function CalendarView() {
  const { matches, selectedTeam } = useApp();

  return (
    <Card title={`Calendrier${selectedTeam ? ` - ${selectedTeam.name}` : ''}`}>
      <div className="space-y-3">
        {matches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-2">📅</p>
            <p>Aucun match prévu</p>
          </div>
        ) : (
          matches.map(match => (
            <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-800">{match.opponent}</p>
                <p className="text-sm text-gray-500">{match.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{match.date}</p>
                <p className="text-sm text-gray-500">{match.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

function ClubSwitcher() {
  const { clubs, selectedClubId, switchClub, showClubSwitcher, setShowClubSwitcher } = useApp();

  if (!showClubSwitcher) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Mes clubs</h2>
            <button
              onClick={() => setShowClubSwitcher(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Sélectionnez le club que vous souhaitez gérer</p>
        </div>

        <div className="p-6 grid gap-4">
          {clubs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-4xl mb-2">🏢</p>
              <p>Vous n'êtes membre d'aucun club</p>
              <Button variant="primary" className="mt-4">
                Créer mon premier club
              </Button>
            </div>
          ) : (
            clubs.map(club => (
              <button
                key={club.id}
                onClick={() => switchClub(club.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  selectedClubId === club.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-4xl">{club.logo}</div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg text-gray-800">{club.name}</h3>
                  <p className="text-sm text-gray-600">{club.sport} • {club.city}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={club.membership?.role === 'admin' ? 'admin' : 'coach'}>
                    {club.membership?.role === 'admin' ? 'Administrateur' : 'Entraîneur'}
                  </Badge>
                  {selectedClubId === club.id && (
                    <span className="text-blue-600 text-xl">✓</span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// 📄 PAGES
// ============================================

function DashboardPage() {
  return (
    <div className="space-y-6">
      <StatsPanel />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PlayersList />
        </div>
        <div className="space-y-6">
          <CalendarView />
        </div>
      </div>
    </div>
  );
}

function PlayersPage() {
  const { players, setSelectedPlayer, hasPermission, selectedTeam } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des joueurs</h1>
          <p className="text-gray-600 mt-1">
            {selectedTeam?.name} • {players.length} joueur{players.length > 1 ? 's' : ''}
          </p>
        </div>
        {hasPermission('write') && (
          <Button icon="➕" onClick={() => alert('Ajouter un joueur - À implémenter')}>
            Ajouter un joueur
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.length === 0 ? (
          <Card className="col-span-full">
            <div className="text-center py-12 text-gray-500">
              <p className="text-6xl mb-4">👥</p>
              <p className="text-xl font-semibold mb-2">Aucun joueur</p>
              <p className="text-gray-600 mb-4">Commencez par ajouter des joueurs à cette équipe</p>
              {hasPermission('write') && (
                <Button onClick={() => alert('Ajouter un joueur - À implémenter')}>
                  Ajouter le premier joueur
                </Button>
              )}
            </div>
          </Card>
        ) : (
          players.map(player => (
            <Card 
              key={player.id} 
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedPlayer(player)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {player.name?.split(' ').map(n => n[0]).join('') || '??'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{player.name}</h3>
                  <p className="text-sm text-gray-600">{player.position}</p>
                  {player.jerseyNumber && (
                    <p className="text-xs text-gray-500">N° {player.jerseyNumber}</p>
                  )}
                </div>
                <Badge variant={player.status === 'active' ? 'success' : 'warning'}>
                  {player.status === 'active' ? 'Actif' : 'Blessé'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Essais</p>
                  <p className="text-lg font-bold text-blue-600">{player.stats?.tries || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Placages</p>
                  <p className="text-lg font-bold text-green-600">{player.stats?.tackles || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Présence</p>
                  <p className="text-lg font-bold text-purple-600">{player.stats?.attendance || 0}%</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function CalendarPage() {
  const { matches, selectedTeam, hasPermission } = useApp();

  const upcomingMatches = matches.filter(m => m.status === 'upcoming');
  const pastMatches = matches.filter(m => m.status === 'finished');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Calendrier</h1>
          <p className="text-gray-600 mt-1">
            {selectedTeam?.name} • {matches.length} match{matches.length > 1 ? 's' : ''}
          </p>
        </div>
        {hasPermission('write') && (
          <Button icon="➕" onClick={() => alert('Ajouter un match - À implémenter')}>
            Ajouter un match
          </Button>
        )}
      </div>

      {/* Matchs à venir */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🔜</span>
          Matchs à venir ({upcomingMatches.length})
        </h2>
        
        {upcomingMatches.length === 0 ? (
          <Card>
            <div className="text-center py-8 text-gray-500">
              <p className="text-4xl mb-2">📅</p>
              <p>Aucun match prévu</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingMatches.map(match => (
              <Card key={match.id} className="hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {match.opponent}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span>📍</span>
                      {match.location} {match.venue && `• ${match.venue}`}
                    </p>
                  </div>
                  <Badge variant="info">À venir</Badge>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>📅</span>
                    <span className="font-medium">{match.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>🕐</span>
                    <span className="font-medium">{match.time}</span>
                  </div>
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

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}