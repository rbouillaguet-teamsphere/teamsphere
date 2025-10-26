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
  console.log('👤 currentUser:', currentUser);  // ⬅️ AJOUTER CETTE LIGNE
  console.log('👤 currentUser.uid:', currentUser?.uid);  // ⬅️ ET CELLE-CI
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
    completeOnboarding,
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

const completeOnboarding = async (onboardingData) => {
    try {
      // 1. Créer le club
      const clubId = await createClub(onboardingData.club);
      
      // 2. Créer l'équipe
      const teamId = await createTeam(clubId, onboardingData.team);
      
      // 3. Ajouter les joueurs
      if (onboardingData.players?.length) {
        for (const player of onboardingData.players) {
          await addPlayer(clubId, teamId, player);
        }
      }
      
      // 4. Envoyer les invitations
      if (onboardingData.invites?.length) {
        // TODO: Implémenter sendInvitations
        // await sendInvitations(clubId, onboardingData.invites);
      }
      
      // 5. Marquer l'onboarding comme terminé
      await updateDoc(doc(db, 'users', currentUser.uid), {
        'onboarding.completed': true,
        'onboarding.completedAt': serverTimestamp(),
      });
      
      // 6. Rediriger vers le dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };