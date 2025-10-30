// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authService } = useApp();
  const [statsMenuOpen, setStatsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Accueil', icon: '🏠', path: '/dashboard' },
    { id: 'players', label: 'Joueurs', icon: '👥', path: '/players' },
    { id: 'calendar', label: 'Calendrier', icon: '📅', path: '/calendar' },
  ];

  const statsSubItems = [
    { id: 'stats-overview', label: "Vue d'ensemble", icon: '📊', path: '/statistics/overview' },
    { id: 'stats-players', label: 'Par joueur', icon: '👥', path: '/statistics/players' },
    { id: 'stats-events', label: 'Par événement', icon: '📅', path: '/statistics/events' },
    { id: 'stats-rankings', label: 'Classements', icon: '🏆', path: '/statistics/rankings' },
    { id: 'stats-charts', label: 'Graphiques', icon: '📈', path: '/statistics/charts' },
  ];

  const isActive = (path) => location.pathname === path;
  const isStatsActive = () => location.pathname.startsWith('/statistics');

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur logout:', error);
    }
  };

  // Ouvrir automatiquement le menu Stats si on est sur une page de stats
  React.useEffect(() => {
    if (isStatsActive()) {
      setStatsMenuOpen(true);
    }
  }, [location.pathname]);

  return (
    <div className="w-64 bg-gray-900 min-h-screen text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">🏉 TeamSphere</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {/* Menu items normaux */}
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-colors duration-200
                  ${isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}

          {/* Menu Statistiques avec sous-menu */}
          <li>
            <button
              onClick={() => setStatsMenuOpen(!statsMenuOpen)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-lg
                transition-colors duration-200
                ${isStatsActive()
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">📊</span>
                <span className="font-medium">Statistiques</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  statsMenuOpen ? 'transform rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Sous-menu */}
            {statsMenuOpen && (
              <ul className="mt-2 ml-4 space-y-1">
                {statsSubItems.map((subItem) => (
                  <li key={subItem.id}>
                    <button
                      onClick={() => navigate(subItem.path)}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-2 rounded-lg
                        transition-colors duration-200 text-sm
                        ${isActive(subItem.path)
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                        }
                      `}
                    >
                      <span>{subItem.icon}</span>
                      <span>{subItem.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Footer - Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;