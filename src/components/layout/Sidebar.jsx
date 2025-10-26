// src/components/layout/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authService } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Accueil', icon: '🏠', path: '/dashboard' },
    { id: 'players', label: 'Joueurs', icon: '👥', path: '/players' },
    { id: 'calendar', label: 'Calendrier', icon: '📅', path: '/calendar' },
    { id: 'statistics', label: 'Statistiques', icon: '📊', path: '/statistics' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur logout:', error);
    }
  };

  return (
    <div className="w-64 bg-gray-900 min-h-screen text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">🏉 TeamSphere</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
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