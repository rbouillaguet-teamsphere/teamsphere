// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  authService, 
  userService, 
  clubService, 
  teamService, 
  playerService,
  matchService 
} from '@/services/firebase';

const AppContext = createContext();

export function AppProvider({ children }) {
  // User state
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Clubs & Teams state
  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  // UI state
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showClubSwitcher, setShowClubSwitcher] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  // Écouter les changements d'authentification
  useEffect(() => {
    const unsubscribe = authService.onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser);
        
        try {
          // Charger le profil utilisateur
          const profile = await userService.getProfile(firebaseUser.uid);
          setUserProfile(profile);
          
          // Charger les clubs de l'utilisateur
          const userClubs = await clubService.getUserClubs(firebaseUser.uid);
          setClubs(userClubs);
          
          // Sélectionner le premier club par défaut
          if (userClubs.length > 0 && !selectedClubId) {
            setSelectedClubId(userClubs[0].id);
          }
        } catch (error) {
          console.error('Erreur chargement données utilisateur:', error);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setClubs([]);
        setSelectedClubId(null);
      }
      
      setLoading(false);
      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  // Charger les équipes quand le club change
  useEffect(() => {
    if (!selectedClubId) {
      setTeams([]);
      return;
    }

    const loadTeams = async () => {
      try {
        const teamsData = await teamService.getAll(selectedClubId);
        setTeams(teamsData);
        
        // Sélectionner la première équipe si aucune n'est sélectionnée
        if (teamsData.length > 0 && !selectedTeamId) {
          setSelectedTeamId(teamsData[0].id);
        }
      } catch (error) {
        console.error('Erreur chargement équipes:', error);
      }
    };

    loadTeams();

    // Écouter les changements en temps réel
    const unsubscribe = teamService.listen(selectedClubId, setTeams);
    return unsubscribe;
  }, [selectedClubId]);

  // Charger joueurs et matchs quand l'équipe change
  useEffect(() => {
    if (!selectedClubId || !selectedTeamId) {
      setPlayers([]);
      setMatches([]);
      return;
    }

    const loadData = async () => {
      try {
        const [playersData, matchesData] = await Promise.all([
          playerService.getAll(selectedClubId, selectedTeamId),
          matchService.getAll(selectedClubId, selectedTeamId)
        ]);
        
        setPlayers(playersData);
        setMatches(matchesData);
      } catch (error) {
        console.error('Erreur chargement données équipe:', error);
      }
    };

    loadData();

    // Écouter les changements en temps réel des joueurs
    const unsubscribePlayers = playerService.listen(
      selectedClubId, 
      selectedTeamId, 
      setPlayers
    );

    // Écouter les changements en temps réel des matchs
    const unsubscribeMatches = matchService.listen(
      selectedClubId,
      selectedTeamId,
      setMatches
    );

    return () => {
      unsubscribePlayers();
      unsubscribeMatches();
    };
  }, [selectedClubId, selectedTeamId]);

  // Computed values
  const selectedClub = clubs.find(c => c.id === selectedClubId);
  const selectedTeam = teams.find(t => t.id === selectedTeamId);
  const userMembership = selectedClub?.membership;

  // Vérifier les permissions
  const hasPermission = (action) => {
    if (!userMembership) return false;
    
    const permissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'manage_teams'],
      coach: ['read', 'write'],
      player: ['read'],
      viewer: ['read']
    };
    
    return permissions[userMembership.role]?.includes(action) || false;
  };

  // Switch club
  const switchClub = (clubId) => {
    setSelectedClubId(clubId);
    const firstTeam = teams.find(t => t.clubId === clubId);
    setSelectedTeamId(firstTeam?.id || null);
    setShowClubSwitcher(false);
  };

  // Login
  const login = async (email, password) => {
    try {
      await authService.login(email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register
  const register = async (email, password, displayName) => {
    try {
      await authService.register(email, password, displayName);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authService.logout();
      setClubs([]);
      setSelectedClubId(null);
      setSelectedTeamId(null);
      setTeams([]);
      setPlayers([]);
      setMatches([]);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    // User
    currentUser,
    userProfile,
    loading,
    authChecked,
    login,
    register,
    logout,
    
    // Permissions
    userMembership,
    hasPermission,
    
    // Clubs & Teams
    clubs,
    selectedClub,
    selectedClubId,
    setSelectedClubId,
    selectedTeam,
    selectedTeamId,
    setSelectedTeamId,
    switchClub,
    teams,
    
    // Data
    players,
    matches,
    
    // UI State
    selectedPlayer,
    setSelectedPlayer,
    sidebarOpen,
    setSidebarOpen,
    showClubSwitcher,
    setShowClubSwitcher,
    currentView,
    setCurrentView,
    
    // Services exposés
    clubService,
    teamService,
    playerService,
    matchService,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}