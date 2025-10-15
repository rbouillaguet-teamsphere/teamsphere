# 🔥 Services Firebase - TeamSphere

## Configuration Firebase

### Installation
```bash
npm install firebase
```

### Initialisation
```javascript
// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## Authentication Service

### authService.js
```javascript
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const authService = {
  // Inscription
  register: async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // Connexion
  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // Déconnexion
  logout: async () => {
    await signOut(auth);
  },

  // Observer l'état d'authentification
  onAuthChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  // Utilisateur actuel
  getCurrentUser: () => {
    return auth.currentUser;
  }
};
```

## User Service

### userService.js
```javascript
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const userService = {
  // Créer un profil utilisateur
  createProfile: async (userId, data) => {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...data,
      createdAt: new Date().toISOString()
    });
  },

  // Récupérer un profil
  getProfile: async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  },

  // Mettre à jour un profil
  updateProfile: async (userId, data) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
  }
};
```

## Club Service

### clubService.js
```javascript
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs,
  updateDoc, 
  deleteDoc,
  query,
  where 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const clubService = {
  // Créer un club
  create: async (clubData, userId) => {
    const clubRef = await addDoc(collection(db, 'clubs'), {
      ...clubData,
      createdBy: userId,
      createdAt: new Date().toISOString()
    });

    // Créer automatiquement un membership admin
    await addDoc(collection(db, 'memberships'), {
      userId,
      clubId: clubRef.id,
      role: 'admin',
      createdAt: new Date().toISOString()
    });

    return clubRef.id;
  },

  // Récupérer un club
  get: async (clubId) => {
    const clubRef = doc(db, 'clubs', clubId);
    const clubSnap = await getDoc(clubRef);
    
    if (clubSnap.exists()) {
      return { id: clubSnap.id, ...clubSnap.data() };
    }
    return null;
  },

  // Récupérer les clubs d'un utilisateur
  getUserClubs: async (userId) => {
    // Récupérer les memberships
    const membershipsQuery = query(
      collection(db, 'memberships'),
      where('userId', '==', userId)
    );
    const membershipsSnap = await getDocs(membershipsQuery);
    
    const clubs = [];
    for (const membershipDoc of membershipsSnap.docs) {
      const membership = membershipDoc.data();
      const club = await clubService.get(membership.clubId);
      if (club) {
        clubs.push({
          ...club,
          role: membership.role
        });
      }
    }
    
    return clubs;
  },

  // Mettre à jour un club
  update: async (clubId, data) => {
    const clubRef = doc(db, 'clubs', clubId);
    await updateDoc(clubRef, data);
  },

  // Supprimer un club
  delete: async (clubId) => {
    const clubRef = doc(db, 'clubs', clubId);
    await deleteDoc(clubRef);
    
    // Supprimer aussi les memberships
    const membershipsQuery = query(
      collection(db, 'memberships'),
      where('clubId', '==', clubId)
    );
    const membershipsSnap = await getDocs(membershipsQuery);
    
    for (const membershipDoc of membershipsSnap.docs) {
      await deleteDoc(membershipDoc.ref);
    }
  }
};
```

## Team Service

### teamService.js
```javascript
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs,
  updateDoc, 
  deleteDoc,
  query,
  where 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const teamService = {
  // Créer une équipe
  create: async (teamData) => {
    const teamRef = await addDoc(collection(db, 'teams'), {
      ...teamData,
      createdAt: new Date().toISOString()
    });
    return teamRef.id;
  },

  // Récupérer les équipes d'un club
  getByClub: async (clubId) => {
    const teamsQuery = query(
      collection(db, 'teams'),
      where('clubId', '==', clubId)
    );
    const teamsSnap = await getDocs(teamsQuery);
    
    return teamsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Mettre à jour une équipe
  update: async (teamId, data) => {
    const teamRef = doc(db, 'teams', teamId);
    await updateDoc(teamRef, data);
  },

  // Supprimer une équipe
  delete: async (teamId) => {
    const teamRef = doc(db, 'teams', teamId);
    await deleteDoc(teamRef);
  }
};
```

## Player Service

### playerService.js
```javascript
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs,
  updateDoc, 
  deleteDoc,
  query,
  where 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const playerService = {
  // Créer un joueur
  create: async (playerData) => {
    const playerRef = await addDoc(collection(db, 'players'), {
      ...playerData,
      createdAt: new Date().toISOString()
    });
    return playerRef.id;
  },

  // Récupérer les joueurs d'une équipe
  getByTeam: async (teamId) => {
    const playersQuery = query(
      collection(db, 'players'),
      where('teamId', '==', teamId)
    );
    const playersSnap = await getDocs(playersQuery);
    
    return playersSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Mettre à jour un joueur
  update: async (playerId, data) => {
    const playerRef = doc(db, 'players', playerId);
    await updateDoc(playerRef, data);
  },

  // Supprimer un joueur
  delete: async (playerId) => {
    const playerRef = doc(db, 'players', playerId);
    await deleteDoc(playerRef);
  }
};
```

## Match Service

### matchService.js
```javascript
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs,
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const matchService = {
  // Créer un match
  create: async (matchData) => {
    const matchRef = await addDoc(collection(db, 'matches'), {
      ...matchData,
      createdAt: new Date().toISOString()
    });
    return matchRef.id;
  },

  // Récupérer les matchs d'une équipe
  getByTeam: async (teamId) => {
    const matchesQuery = query(
      collection(db, 'matches'),
      where('teamId', '==', teamId),
      orderBy('date', 'desc')
    );
    const matchesSnap = await getDocs(matchesQuery);
    
    return matchesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Mettre à jour un match
  update: async (matchId, data) => {
    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, data);
  },

  // Supprimer un match
  delete: async (matchId) => {
    const matchRef = doc(db, 'matches', matchId);
    await deleteDoc(matchRef);
  }
};
```

## Gestion des erreurs
```javascript
// Wrapper pour gérer les erreurs Firebase
export const handleFirebaseError = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Cet email est déjà utilisé';
    case 'auth/invalid-email':
      return 'Email invalide';
    case 'auth/weak-password':
      return 'Mot de passe trop faible';
    case 'auth/user-not-found':
      return 'Utilisateur non trouvé';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect';
    case 'permission-denied':
      return 'Permissions insuffisantes';
    default:
      return 'Une erreur est survenue';
  }
};
```

## Bonnes pratiques

1. **Toujours gérer les erreurs** avec try/catch
2. **Utiliser les indexes** pour les requêtes complexes
3. **Limiter les requêtes** avec pagination
4. **Valider les données** côté client ET serveur (rules)
5. **Ne jamais exposer** les credentials dans le code