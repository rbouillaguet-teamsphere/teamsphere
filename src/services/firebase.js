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
  serverTimestamp
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
  
  // Récupérer tous les joueurs d'une équipe
  getAll: async (clubId, teamId) => {
    const snapshot = await getDocs(
      collection(db, `clubs/${clubId}/teams/${teamId}/players`)
    );
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
// 🏆 MATCH SERVICES
// ============================================
export const matchService = {
  // Créer un match
  create: async (clubId, teamId, matchData) => {
    const matchRef = await addDoc(
      collection(db, `clubs/${clubId}/teams/${teamId}/matches`),
      {
        ...matchData,
        createdAt: serverTimestamp()
      }
    );
    return matchRef.id;
  },
  
  // Récupérer tous les matchs
  getAll: async (clubId, teamId) => {
    const snapshot = await getDocs(
      query(
        collection(db, `clubs/${clubId}/teams/${teamId}/matches`),
        orderBy('date', 'asc')
      )
    );
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  // Récupérer un match
  get: async (clubId, teamId, matchId) => {
    const docSnap = await getDoc(
      doc(db, `clubs/${clubId}/teams/${teamId}/matches`, matchId)
    );
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  // Mettre à jour
  update: async (clubId, teamId, matchId, updates) => {
    await updateDoc(
      doc(db, `clubs/${clubId}/teams/${teamId}/matches`, matchId),
      updates
    );
  },
  
  // Supprimer
  delete: async (clubId, teamId, matchId) => {
    await deleteDoc(
      doc(db, `clubs/${clubId}/teams/${teamId}/matches`, matchId)
    );
  },
  
  // Écouter les changements en temps réel
  listen: (clubId, teamId, callback) => {
    return onSnapshot(
      query(
        collection(db, `clubs/${clubId}/teams/${teamId}/matches`),
        orderBy('date', 'asc')
      ),
      (snapshot) => {
        const matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(matches);
      }
    );
  },
};