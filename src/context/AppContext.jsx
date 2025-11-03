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
import { auth } from '@/services/firebase';
import { createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/services/firebase';

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
          console.error('Erreur lors du chargement du profil:', error);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setClubs([]);
      }
      
      setLoading(false);
      setAuthChecked(true);
    });

    return unsubscribe;
  }, [selectedClubId]);

  // Charger les équipes quand un club est sélectionné
  useEffect(() => {
    if (selectedClubId) {
      loadTeams(selectedClubId);
    }
  }, [selectedClubId]);

  // Charger les joueurs et matchs quand une équipe est sélectionnée
  useEffect(() => {
    if (selectedClubId && selectedTeamId) {
      loadPlayers(selectedClubId, selectedTeamId);
      loadMatches(selectedClubId, selectedTeamId);
    }
  }, [selectedClubId, selectedTeamId]);

  const loadTeams = async (clubId) => {
    try {
      const clubTeams = await teamService.getAll(clubId);
      setTeams(clubTeams);
      
      // Sélectionner la première équipe par défaut
      if (clubTeams.length > 0 && !selectedTeamId) {
        setSelectedTeamId(clubTeams[0].id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des équipes:', error);
    }
  };

  const loadPlayers = async (clubId, teamId) => {
    try {
      const teamPlayers = await playerService.getAll(clubId, teamId);
      setPlayers(teamPlayers);
    } catch (error) {
      console.error('Erreur lors du chargement des joueurs:', error);
    }
  };

  const loadMatches = async (clubId, teamId) => {
    try {
      const teamMatches = await matchService.getAll(clubId, teamId);
      setMatches(teamMatches);
    } catch (error) {
      console.error('Erreur lors du chargement des matchs:', error);
    }
  };

  // Computed values
  const selectedClub = clubs.find(c => c.id === selectedClubId) || null;
  const selectedTeam = teams.find(t => t.id === selectedTeamId) || null;
  
  // Get user membership for selected club
  const userMembership = selectedClub?.memberships?.find(
    m => m.userId === currentUser?.uid
  );

  // Permission helper
  const hasPermission = (permission) => {
    if (!userMembership) return false;
    
    const role = userMembership.role;
    
    switch (permission) {
      case 'edit_club':
        return role === 'admin';
      case 'edit_team':
        return ['admin', 'coach'].includes(role);
      case 'view_team':
        return true; // Tous les membres peuvent voir
      default:
        return false;
    }
  };

  // Switch club helper
  const switchClub = (clubId) => {
    setSelectedClubId(clubId);
    setSelectedTeamId(null);
    setTeams([]);
    setPlayers([]);
    setMatches([]);
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

  // ✨ FONCTION LOGOUT AMÉLIORÉE avec redirection
  const logout = async () => {
    try {
      // Déconnecter de Firebase
      await authService.logout();
      
      // Nettoyer tous les états de l'application
      setClubs([]);
      setSelectedClubId(null);
      setSelectedTeamId(null);
      setTeams([]);
      setPlayers([]);
      setMatches([]);
      setUserProfile(null);
      setCurrentUser(null);
      
      // ✅ Rediriger vers la page de login
      window.location.href = '/login';
      
      console.log('✅ Déconnexion réussie');
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      return { success: false, error: error.message };
    }
  };

  // Signup
  const signup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      const user = userCredential.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: name,
        createdAt: serverTimestamp(),
        onboarding: {
          completed: false,
          startedAt: serverTimestamp(),
        },
      });
      
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.message);
    }
  };

  const completeOnboarding = async (onboardingData) => {
    console.log('👤 currentUser:', currentUser);
    console.log('👤 currentUser.uid:', currentUser?.uid);
    
    if (!currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      console.log('🚀 Onboarding data:', onboardingData);
      console.log('📝 Création du club avec userId:', currentUser.uid);
      
      // 1. Créer le club avec clubService
      const clubId = await clubService.createClub({
        name: onboardingData.club.name,
        sport: onboardingData.club.sport,
        city: onboardingData.club.city,
        ownerId: currentUser.uid,
      }, currentUser.uid);
      
      // 2. Créer l'équipe avec teamService
      const teamId = await teamService.createTeam(clubId, {
        name: onboardingData.team.name,
        category: onboardingData.team.category,
        gender: onboardingData.team.gender,
        season: onboardingData.team.season,
      });
      
      // 3. Ajouter les joueurs
      if (onboardingData.players?.length > 0) {
        for (const player of onboardingData.players) {
          await playerService.addPlayer(clubId, teamId, player);
        }
      }
      
      // 4. Marquer l'onboarding comme terminé
      await userService.updateProfile(currentUser.uid, {
        'onboarding.completed': true,
        'onboarding.completedAt': new Date(),
      });
      
      console.log('✅ Onboarding terminé !');
      window.location.href = '/dashboard';

    } catch (error) {
      console.error('❌ Erreur onboarding:', error);
      throw error;
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
    signup: authService.register,
    completeOnboarding,

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
