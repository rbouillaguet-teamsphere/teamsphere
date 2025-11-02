// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

// Configuration Firebase depuis les variables d'environnement
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ============================================
// 🔐 AUTH SERVICES
// ============================================
export const authService = {
  
// Fonction de signup
  signup: async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Créer le profil utilisateur dans Firestore
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
      throw error;
    }
  },

  // Login
  login: (email, password) => 
    signInWithEmailAndPassword(auth, email, password),
  
  // Register
  register: async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Créer le profil utilisateur dans Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      name: displayName,
      createdAt: serverTimestamp()
    });
    
    return userCredential;
  },
  
  // Logout
  logout: () => signOut(auth),
  
  // Reset password
  resetPassword: (email) => sendPasswordResetEmail(auth, email),
  
  // Observer auth state
  onAuthChange: (callback) => onAuthStateChanged(auth, callback),
};

// ============================================
// 👤 USER SERVICES
// ============================================
export const userService = {
  // Récupérer le profil utilisateur
  getProfile: async (userId) => {
    const docSnap = await getDoc(doc(db, 'users', userId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  // Mettre à jour le profil
  updateProfile: async (userId, data) => {
    await updateDoc(doc(db, 'users', userId), data);
  },
  
  // Récupérer les memberships
  getMemberships: async (userId) => {
    const snapshot = await getDocs(
      collection(db, `users/${userId}/clubMemberships`)
    );
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
};

// ============================================
// 🏢 CLUB SERVICES
// ============================================
export const clubService = {
  // Créer un club
  create: async (clubData, userId) => {
    // Créer le club
    const clubRef = await addDoc(collection(db, 'clubs'), {
      ...clubData,
      ownerId: userId,
      createdAt: serverTimestamp()
    });
    
    // Ajouter le créateur comme admin
    await setDoc(doc(db, `clubs/${clubRef.id}/members`, userId), {
      role: 'admin',
      status: 'active',
      joinedAt: serverTimestamp()
    });
    
    // Ajouter dans les memberships de l'utilisateur
    await setDoc(doc(db, `users/${userId}/clubMemberships`, clubRef.id), {
      role: 'admin',
      status: 'active',
      joinedAt: serverTimestamp()
    });
    
    return clubRef.id;
  },
  
  // Alias pour createClub (plus parlant)
  createClub: async (clubData, userId) => {
    return clubService.create(clubData, userId);
  },
  
  // Récupérer un club
  get: async (clubId) => {
    const docSnap = await getDoc(doc(db, 'clubs', clubId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  // Récupérer tous les clubs d'un user
  getUserClubs: async (userId) => {
    const memberships = await userService.getMemberships(userId);
    
    const clubs = await Promise.all(
      memberships.map(async (membership) => {
        const club = await clubService.get(membership.id);
        return club ? { ...club, membership } : null;
      })
    );
    
    return clubs.filter(club => club !== null);
  },
  
  // Mettre à jour un club
  update: async (clubId, updates) => {
    await updateDoc(doc(db, 'clubs', clubId), updates);
  },
  
  // Supprimer un club
  delete: async (clubId) => {
    await deleteDoc(doc(db, 'clubs', clubId));
  },
  
  // Récupérer les membres
  getMembers: async (clubId) => {
    const snapshot = await getDocs(collection(db, `clubs/${clubId}/members`));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  // Ajouter un membre
  addMember: async (clubId, userId, role = 'coach') => {
    await setDoc(doc(db, `clubs/${clubId}/members`, userId), {
      role,
      status: 'active',
      joinedAt: serverTimestamp()
    });
    
    await setDoc(doc(db, `users/${userId}/clubMemberships`, clubId), {
      role,
      status: 'active',
      joinedAt: serverTimestamp()
    });
  },
};

// ============================================
// 🏉 TEAM SERVICES
// ============================================
export const teamService = {
  // Créer une équipe
  create: async (clubId, teamData) => {
    const teamRef = await addDoc(
      collection(db, `clubs/${clubId}/teams`),
      {
        ...teamData,
        createdAt: serverTimestamp()
      }
    );
    return teamRef.id;
  },

  // Alias pour createTeam
  createTeam: async (clubId, teamData) => {
    return teamService.create(clubId, teamData);
  },
  
  // Récupérer toutes les équipes d'un club
  getAll: async (clubId) => {
    const snapshot = await getDocs(
      query(
        collection(db, `clubs/${clubId}/teams`),
        orderBy('createdAt', 'desc')
      )
    );
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  // Récupérer une équipe
  get: async (clubId, teamId) => {
    const docSnap = await getDoc(doc(db, `clubs/${clubId}/teams`, teamId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  // Mettre à jour
  update: async (clubId, teamId, updates) => {
    await updateDoc(doc(db, `clubs/${clubId}/teams`, teamId), updates);
  },
  
  // Supprimer
  delete: async (clubId, teamId) => {
    await deleteDoc(doc(db, `clubs/${clubId}/teams`, teamId));
  },
  
  // Écouter les changements en temps réel
  listen: (clubId, callback) => {
    return onSnapshot(
      query(collection(db, `clubs/${clubId}/teams`)),
      (snapshot) => {
        const teams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(teams);
      }
    );
  },
};

// ============================================
// 👤 PLAYER SERVICES
// ============================================
export const playerService = {
  // Créer un joueur
  create: async (clubId, teamId, playerData) => {
    const playerRef = await addDoc(
      collection(db, `clubs/${clubId}/teams/${teamId}/players`),
      {
        ...playerData,
        stats: {
          tries: 0,
          tackles: 0,
          attendance: 0,
          ...playerData.stats
        },
        createdAt: serverTimestamp()
      }
    );
    return playerRef.id;
  },
  
  // Alias pour addPlayer
  addPlayer: async (clubId, teamId, playerData) => {
    return playerService.create(clubId, teamId, playerData);
  },

  // Récupérer tous les joueurs d'une équipe
  getAll: async (clubId, teamId) => {
    const snapshot = await getDocs(
      collection(db, `clubs/${clubId}/teams/${teamId}/players`)
    );
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  // Alias pour compatibilité CalendarPage
  getTeamPlayers: async (clubId, teamId) => {
    return playerService.getAll(clubId, teamId);
  },
  
  // Récupérer un joueur
  get: async (clubId, teamId, playerId) => {
    const docSnap = await getDoc(
      doc(db, `clubs/${clubId}/teams/${teamId}/players`, playerId)
    );
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  // Mettre à jour
  update: async (clubId, teamId, playerId, updates) => {
    await updateDoc(
      doc(db, `clubs/${clubId}/teams/${teamId}/players`, playerId),
      updates
    );
  },
  
  // Supprimer
  delete: async (clubId, teamId, playerId) => {
    await deleteDoc(
      doc(db, `clubs/${clubId}/teams/${teamId}/players`, playerId)
    );
  },
  
  // Écouter les changements en temps réel
  listen: (clubId, teamId, callback) => {
    return onSnapshot(
      collection(db, `clubs/${clubId}/teams/${teamId}/players`),
      (snapshot) => {
        const players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(players);
      }
    );
  },
};

// ============================================
// 🏆 MATCH SERVICES (VERSION COMPLÈTE)
// ============================================
export const matchService = {
  /**
   * Créer un match
   */
  create: async (clubId, teamId, matchData) => {
    try {
      const matchRef = await addDoc(
        collection(db, `clubs/${clubId}/teams/${teamId}/matches`),
        {
          ...matchData,
          teamId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      );
      return matchRef.id;
    } catch (error) {
      console.error('Erreur lors de la création du match:', error);
      throw error;
    }
  },

  /**
   * Alias pour create (pour compatibilité)
   */
  createMatch: async (clubId, teamId, matchData) => {
    return matchService.create(clubId, teamId, matchData);
  },
  
  /**
   * Récupérer tous les matchs d'une équipe
   */
  getAll: async (clubId, teamId) => {
    try {
      const snapshot = await getDocs(
        query(
          collection(db, `clubs/${clubId}/teams/${teamId}/matches`),
          orderBy('date', 'desc')
        )
      );
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erreur lors de la récupération des matchs:', error);
      throw error;
    }
  },

  /**
   * Alias pour getAll (pour compatibilité avec CalendarPage)
   */
  getTeamMatches: async (clubId, teamId) => {
    return matchService.getAll(clubId, teamId);
  },
  
  /**
   * Récupérer un match spécifique
   */
  get: async (clubId, teamId, matchId) => {
    try {
      const docSnap = await getDoc(
        doc(db, `clubs/${clubId}/teams/${teamId}/matches`, matchId)
      );
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error('Erreur lors de la récupération du match:', error);
      throw error;
    }
  },

  /**
   * Alias pour get
   */
  getMatch: async (clubId, teamId, matchId) => {
    return matchService.get(clubId, teamId, matchId);
  },
  
  /**
   * Mettre à jour un match
   */
  update: async (clubId, teamId, matchId, updates) => {
    try {
      await updateDoc(
        doc(db, `clubs/${clubId}/teams/${teamId}/matches`, matchId),
        {
          ...updates,
          updatedAt: serverTimestamp()
        }
      );
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du match:', error);
      throw error;
    }
  },

  /**
   * Alias pour update
   */
  updateMatch: async (clubId, teamId, matchId, updates) => {
    return matchService.update(clubId, teamId, matchId, updates);
  },
  
  /**
   * Supprimer un match
   */
  delete: async (clubId, teamId, matchId) => {
    try {
      await deleteDoc(
        doc(db, `clubs/${clubId}/teams/${teamId}/matches`, matchId)
      );
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du match:', error);
      throw error;
    }
  },

  /**
   * Alias pour delete
   */
  deleteMatch: async (clubId, teamId, matchId) => {
    return matchService.delete(clubId, teamId, matchId);
  },

  /**
   * Récupérer les matchs à venir (prochains matchs)
   */
  getUpcomingMatches: async (clubId, teamId, limit = 5) => {
    try {
      const matchesRef = collection(db, `clubs/${clubId}/teams/${teamId}/matches`);
      const now = new Date();
      
      const q = query(
        matchesRef,
        where('date', '>=', now),
        where('status', '==', 'upcoming'),
        orderBy('date', 'asc')
      );
      
      const snapshot = await getDocs(q);
      
      const matches = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return matches.slice(0, limit);
    } catch (error) {
      console.error('Erreur lors de la récupération des matchs à venir:', error);
      // Si l'erreur vient d'un index manquant, retourner un tableau vide
      return [];
    }
  },

  /**
   * Récupérer les résultats récents
   */
  getRecentResults: async (clubId, teamId, limit = 5) => {
    try {
      const matchesRef = collection(db, `clubs/${clubId}/teams/${teamId}/matches`);
      
      const q = query(
        matchesRef,
        where('status', '==', 'completed'),
        orderBy('date', 'desc')
      );
      
      const snapshot = await getDocs(q);
      
      const matches = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return matches.slice(0, limit);
    } catch (error) {
      console.error('Erreur lors de la récupération des résultats récents:', error);
      return [];
    }
  },

  /**
   * Mettre à jour le score d'un match
   */
  updateMatchScore: async (clubId, teamId, matchId, scoreTeam, scoreOpponent) => {
    try {
      const matchRef = doc(db, `clubs/${clubId}/teams/${teamId}/matches`, matchId);
      
      await updateDoc(matchRef, {
        scoreTeam,
        scoreOpponent,
        status: 'completed',
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du score:', error);
      throw error;
    }
  },

  /**
   * Calculer les statistiques d'une équipe
   */
  getTeamMatchStats: async (clubId, teamId) => {
    try {
      const matches = await matchService.getAll(clubId, teamId);
      
      const stats = {
        total: matches.length,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        upcoming: 0
      };
      
      matches.forEach(match => {
        if (match.status === 'completed' && match.scoreTeam !== null && match.scoreTeam !== undefined) {
          stats.played++;
          stats.goalsFor += match.scoreTeam || 0;
          stats.goalsAgainst += match.scoreOpponent || 0;
          
          if (match.scoreTeam > match.scoreOpponent) {
            stats.wins++;
          } else if (match.scoreTeam === match.scoreOpponent) {
            stats.draws++;
          } else {
            stats.losses++;
          }
        } else if (match.status === 'upcoming') {
          stats.upcoming++;
        }
      });
      
      stats.goalDifference = stats.goalsFor - stats.goalsAgainst;
      stats.winRate = stats.played > 0 ? (stats.wins / stats.played * 100).toFixed(1) : '0';
      
      return stats;
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      throw error;
    }
  },
  
  /**
   * Écouter les changements en temps réel
   */
  listen: (clubId, teamId, callback) => {
    return onSnapshot(
      query(
        collection(db, `clubs/${clubId}/teams/${teamId}/matches`),
        orderBy('date', 'desc')
      ),
      (snapshot) => {
        const matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(matches);
      },
      (error) => {
        console.error('Erreur lors de l\'écoute des matchs:', error);
      }
    );
  },
};


/**
 * Créer un nouveau compte utilisateur
 */
export async function signup(email, password, name) {
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
    
    console.log('✅ Utilisateur créé:', user.uid);
    return user;
    
  } catch (error) {
    console.error('❌ Erreur signup:', error);
    
    let errorMessage = error.message;
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Cet email est déjà utilisé';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Le mot de passe est trop faible';
    }
    
    throw new Error(errorMessage);
  }
}
/**
 * Envoyer des invitations
 */
export async function sendInvitations(clubId, invites) {
  try {
    for (const invite of invites) {
      const inviteId = `${clubId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await setDoc(doc(db, 'invitations', inviteId), {
        clubId: clubId,
        email: invite.email,
        role: invite.role,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
    }
    
    console.log('✅ Invitations créées:', invites.length);
    
  } catch (error) {
    console.error('❌ Erreur sendInvitations:', error);
    throw error;
  }
}
// ============================================
// 📅 EVENT SERVICES (Semaines 3-4)
// ============================================
/**
 * Service de gestion des événements (entraînements, matchs, réunions, etc.)
 */
export const eventService = {
  /**
   * Créer un nouvel événement
   */
  create: async (clubId, teamId, eventData) => {
    try {
      const eventsRef = collection(db, 'clubs', clubId, 'teams', teamId, 'events');
      
      const newEvent = {
        ...eventData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        convocationSent: false,
        convocationDate: null,
      };

      const docRef = await addDoc(eventsRef, newEvent);
      return { id: docRef.id, ...newEvent };
    } catch (error) {
      console.error('Erreur création événement:', error);
      throw error;
    }
  },

  /**
   * Récupérer tous les événements d'une équipe
   */
  getTeamEvents: async (clubId, teamId) => {
    try {
      const eventsRef = collection(db, 'clubs', clubId, 'teams', teamId, 'events');
      const q = query(eventsRef, orderBy('date', 'asc'));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur récupération événements:', error);
      throw error;
    }
  },

  /**
   * Récupérer un événement par ID
   */
  getById: async (clubId, teamId, eventId) => {
    try {
      const eventRef = doc(db, 'clubs', clubId, 'teams', teamId, 'events', eventId);
      const eventDoc = await getDoc(eventRef);
      
      if (!eventDoc.exists()) {
        throw new Error('Événement non trouvé');
      }
      
      return { id: eventDoc.id, ...eventDoc.data() };
    } catch (error) {
      console.error('Erreur récupération événement:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour un événement
   */
  update: async (clubId, teamId, eventId, eventData) => {
    try {
      const eventRef = doc(db, 'clubs', clubId, 'teams', teamId, 'events', eventId);
      
      const updateData = {
        ...eventData,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(eventRef, updateData);
      return { id: eventId, ...updateData };
    } catch (error) {
      console.error('Erreur mise à jour événement:', error);
      throw error;
    }
  },

  /**
   * Supprimer un événement
   */
  delete: async (clubId, teamId, eventId) => {
    try {
      const eventRef = doc(db, 'clubs', clubId, 'teams', teamId, 'events', eventId);
      await deleteDoc(eventRef);
    } catch (error) {
      console.error('Erreur suppression événement:', error);
      throw error;
    }
  },

  /**
   * Récupérer les événements par type
   */
  getByType: async (clubId, teamId, eventType) => {
    try {
      const eventsRef = collection(db, 'clubs', clubId, 'teams', teamId, 'events');
      const q = query(
        eventsRef, 
        where('type', '==', eventType),
        orderBy('date', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur récupération événements par type:', error);
      throw error;
    }
  },

  /**
   * Récupérer les événements à venir
   */
  getUpcoming: async (clubId, teamId) => {
    try {
      const now = new Date();
      const eventsRef = collection(db, 'clubs', clubId, 'teams', teamId, 'events');
      const q = query(
        eventsRef, 
        where('date', '>=', now),
        orderBy('date', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur récupération événements à venir:', error);
      throw error;
    }
  },

  /**
   * Marquer une convocation comme envoyée
   */
  markConvocationSent: async (clubId, teamId, eventId) => {
    try {
      const eventRef = doc(db, 'clubs', clubId, 'teams', teamId, 'events', eventId);
      await updateDoc(eventRef, {
        convocationSent: true,
        convocationDate: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erreur mise à jour convocation:', error);
      throw error;
    }
  }
};

// ============================================
// 📨 CONVOCATION SERVICES
// ============================================
/**
 * Service de gestion des convocations
 */
export const convocationService = {
  /**
   * Créer des convocations pour un événement
   */
  createConvocations: async (clubId, teamId, eventId, playerIds) => {
    try {
      const convocsRef = collection(db, 'clubs', clubId, 'teams', teamId, 'convocations');
      
      const promises = playerIds.map(playerId => 
        addDoc(convocsRef, {
          eventId,
          playerId,
          status: 'pending',
          notifiedAt: serverTimestamp(),
          respondedAt: null,
          createdAt: serverTimestamp(),
        })
      );

      await Promise.all(promises);
      
      // Marquer l'événement comme convoqué
      await eventService.markConvocationSent(clubId, teamId, eventId);
    } catch (error) {
      console.error('Erreur création convocations:', error);
      throw error;
    }
  },

  /**
   * Récupérer les convocations d'un événement
   */
  getEventConvocations: async (clubId, teamId, eventId) => {
    try {
      const convocsRef = collection(db, 'clubs', clubId, 'teams', teamId, 'convocations');
      const q = query(convocsRef, where('eventId', '==', eventId));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur récupération convocations:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour le statut d'une convocation
   */
  updateStatus: async (clubId, teamId, convocationId, status) => {
    try {
      const convocRef = doc(db, 'clubs', clubId, 'teams', teamId, 'convocations', convocationId);
      await updateDoc(convocRef, {
        status,
        respondedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erreur mise à jour statut convocation:', error);
      throw error;
    }
  },

  /**
   * Récupérer les convocations d'un joueur
   */
  getPlayerConvocations: async (clubId, teamId, playerId) => {
    try {
      const convocsRef = collection(db, 'clubs', clubId, 'teams', teamId, 'convocations');
      const q = query(convocsRef, where('playerId', '==', playerId));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur récupération convocations joueur:', error);
      throw error;
    }
  }
};

// ============================================
// ✅ ATTENDANCE SERVICES
// ============================================
/**
 * Service de gestion des présences
 */
export const attendanceService = {
  /**
   * Enregistrer la présence d'un joueur
   */
  recordAttendance: async (clubId, teamId, eventId, playerId, isPresent, reason = null, recordedBy) => {
    try {
      const attendancesRef = collection(db, 'clubs', clubId, 'teams', teamId, 'attendances');
      
      // Vérifier si une présence existe déjà
      const q = query(
        attendancesRef,
        where('eventId', '==', eventId),
        where('playerId', '==', playerId)
      );
      const snapshot = await getDocs(q);

      const attendanceData = {
        eventId,
        playerId,
        present: isPresent,
        reason: reason || null,
        recordedAt: serverTimestamp(),
        recordedBy,
      };

      if (!snapshot.empty) {
        // Mettre à jour l'entrée existante
        const existingDoc = snapshot.docs[0];
        await updateDoc(doc(db, 'clubs', clubId, 'teams', teamId, 'attendances', existingDoc.id), attendanceData);
      } else {
        // Créer une nouvelle entrée
        await addDoc(attendancesRef, {
          ...attendanceData,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Erreur enregistrement présence:', error);
      throw error;
    }
  },

  /**
   * Enregistrer plusieurs présences en une fois
   */
  recordBulkAttendances: async (clubId, teamId, eventId, attendances, recordedBy) => {
    try {
      const promises = attendances.map(({ playerId, present, reason }) =>
        attendanceService.recordAttendance(clubId, teamId, eventId, playerId, present, reason, recordedBy)
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Erreur enregistrement présences multiples:', error);
      throw error;
    }
  },

  /**
   * Récupérer les présences d'un événement
   */
  getEventAttendances: async (clubId, teamId, eventId) => {
    try {
      const attendancesRef = collection(db, 'clubs', clubId, 'teams', teamId, 'attendances');
      const q = query(attendancesRef, where('eventId', '==', eventId));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur récupération présences:', error);
      throw error;
    }
  },

  /**
   * Récupérer l'historique des présences d'un joueur
   */
  getPlayerAttendances: async (clubId, teamId, playerId) => {
    try {
      const attendancesRef = collection(db, 'clubs', clubId, 'teams', teamId, 'attendances');
      const q = query(attendancesRef, where('playerId', '==', playerId));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur récupération présences joueur:', error);
      throw error;
    }
  },

  /**
   * Calculer les statistiques de présence d'un joueur
   */
  getPlayerAttendanceStats: async (clubId, teamId, playerId) => {
    try {
      const attendances = await attendanceService.getPlayerAttendances(clubId, teamId, playerId);
      
      const total = attendances.length;
      const present = attendances.filter(a => a.present).length;
      const absent = total - present;
      const rate = total > 0 ? (present / total) * 100 : 0;

      return {
        total,
        present,
        absent,
        rate: Math.round(rate * 10) / 10
      };
    } catch (error) {
      console.error('Erreur calcul statistiques présence:', error);
      throw error;
    }
  },

  /**
   * Récupérer les statistiques de présence de l'équipe
   */
  getTeamAttendanceStats: async (clubId, teamId) => {
    try {
      const attendancesRef = collection(db, 'clubs', clubId, 'teams', teamId, 'attendances');
      const snapshot = await getDocs(attendancesRef);
      
      const attendances = snapshot.docs.map(doc => doc.data());
      const total = attendances.length;
      const present = attendances.filter(a => a.present).length;
      const rate = total > 0 ? (present / total) * 100 : 0;

      return {
        total,
        present,
        absent: total - present,
        rate: Math.round(rate * 10) / 10
      };
    } catch (error) {
      console.error('Erreur calcul statistiques équipe:', error);
      throw error;
    }
  }
};
