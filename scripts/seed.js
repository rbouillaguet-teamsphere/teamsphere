// scripts/seed.js
// Script pour peupler la base de données Firestore avec des données de test

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';

// Configuration Firebase (vos credentials)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================
// 🎯 DONNÉES DE TEST
// ============================================

const USER_ID = 'qvpRzGnBxaQo9Vkjvn8xPn2NP4F3'; // À remplacer par l'ID de rbouillaguet@teamsphere.fr

const clubData = {
  name: 'ROC GIFFOIS',
  sport: 'Rugby',
  city: 'Gif-sur-Yvette',
  logo: '🏉',
  ownerId: USER_ID,
  settings: {
    primaryColor: '#2563eb',
    accentColor: '#f59e0b'
  }
};

const teams = [
  {
    name: 'Seniors M',
    category: 'Seniors',
    gender: 'M',
    season: '2024-2025'
  },
  {
    name: 'U19',
    category: 'Juniors',
    gender: 'M',
    season: '2024-2025'
  }
];

const players = [
  // Seniors M
  { name: 'Jean Dupont', position: 'Pilier', jerseyNumber: 1, tries: 5, tackles: 42, attendance: 85, status: 'active' },
  { name: 'Marc Leblanc', position: 'Talonneur', jerseyNumber: 2, tries: 3, tackles: 38, attendance: 90, status: 'active' },
  { name: 'Pierre Martin', position: 'Deuxième ligne', jerseyNumber: 4, tries: 2, tackles: 55, attendance: 78, status: 'injured' },
  { name: 'Luc Bernard', position: 'Troisième ligne', jerseyNumber: 6, tries: 8, tackles: 47, attendance: 88, status: 'active' },
  { name: 'Antoine Dubois', position: 'Demi de mêlée', jerseyNumber: 9, tries: 12, tackles: 25, attendance: 92, status: 'active' },
  
  // U19
  { name: 'Thomas Petit', position: 'Pilier', jerseyNumber: 1, tries: 3, tackles: 28, attendance: 82, status: 'active' },
  { name: 'Lucas Moreau', position: 'Talonneur', jerseyNumber: 2, tries: 2, tackles: 22, attendance: 88, status: 'active' },
  { name: 'Hugo Laurent', position: 'Ailier', jerseyNumber: 11, tries: 15, tackles: 12, attendance: 95, status: 'active' },
  { name: 'Nathan Simon', position: 'Arrière', jerseyNumber: 15, tries: 8, tackles: 18, attendance: 90, status: 'active' },
  { name: 'Maxime Roux', position: 'Centre', jerseyNumber: 12, tries: 6, tackles: 32, attendance: 86, status: 'active' }
];

const matches = [
  // Seniors M
  { opponent: 'RC Toulon', date: '2025-10-25', time: '15:00', location: 'Domicile', venue: 'Stade Municipal', status: 'upcoming' },
  { opponent: 'Stade Français', date: '2025-11-01', time: '16:30', location: 'Extérieur', venue: 'Stade Jean Bouin', status: 'upcoming' },
  { opponent: 'Lyon OU', date: '2025-11-08', time: '14:00', location: 'Domicile', venue: 'Stade Municipal', status: 'upcoming' },
  
  // U19
  { opponent: 'Racing 92 U19', date: '2025-10-26', time: '14:00', location: 'Extérieur', venue: 'Campus Racing', status: 'upcoming' },
  { opponent: 'Montpellier U19', date: '2025-11-02', time: '15:00', location: 'Domicile', venue: 'Stade Municipal', status: 'upcoming' }
];

// ============================================
// 🚀 FONCTIONS DE SEED
// ============================================

async function seedDatabase() {
  console.log('🌱 Début du seed de la base de données...\n');

  try {
    // 1. Créer le profil utilisateur
    console.log('👤 Création du profil utilisateur...');
    await setDoc(doc(db, 'users', USER_ID), {
      email: 'rbouillaguet@teamsphere.fr',
      name: 'Raphaël Bouillaguet',
      createdAt: serverTimestamp()
    });
    console.log('✅ Profil utilisateur créé\n');

    // 2. Créer le club
    console.log('🏢 Création du club...');
    const clubRef = await addDoc(collection(db, 'clubs'), {
      ...clubData,
      createdAt: serverTimestamp()
    });
    const clubId = clubRef.id;
    console.log(`✅ Club créé avec ID: ${clubId}\n`);

    // 3. Ajouter l'utilisateur comme admin du club
    console.log('👑 Ajout comme admin du club...');
    await setDoc(doc(db, `clubs/${clubId}/members`, USER_ID), {
      role: 'admin',
      status: 'active',
      joinedAt: serverTimestamp()
    });
    
    await setDoc(doc(db, `users/${USER_ID}/clubMemberships`, clubId), {
      role: 'admin',
      status: 'active',
      joinedAt: serverTimestamp()
    });
    console.log('✅ Admin ajouté\n');

    // 4. Créer les équipes
    console.log('🏉 Création des équipes...');
    const teamIds = [];
    
    for (const teamData of teams) {
      const teamRef = await addDoc(collection(db, `clubs/${clubId}/teams`), {
        ...teamData,
        createdAt: serverTimestamp()
      });
      teamIds.push(teamRef.id);
      console.log(`✅ Équipe "${teamData.name}" créée avec ID: ${teamRef.id}`);
    }
    console.log('');

    // 5. Créer les joueurs (5 par équipe)
    console.log('👥 Création des joueurs...');
    
    // Seniors M
    for (let i = 0; i < 5; i++) {
      const playerData = players[i];
      await addDoc(collection(db, `clubs/${clubId}/teams/${teamIds[0]}/players`), {
        ...playerData,
        birthDate: new Date(1995 + i, 0, 15).toISOString(),
        stats: {
          tries: playerData.tries,
          tackles: playerData.tackles,
          attendance: playerData.attendance
        },
        createdAt: serverTimestamp()
      });
      console.log(`✅ Joueur "${playerData.name}" ajouté à Seniors M`);
    }

    // U19
    for (let i = 5; i < 10; i++) {
      const playerData = players[i];
      await addDoc(collection(db, `clubs/${clubId}/teams/${teamIds[1]}/players`), {
        ...playerData,
        birthDate: new Date(2006 + (i - 5), 0, 15).toISOString(),
        stats: {
          tries: playerData.tries,
          tackles: playerData.tackles,
          attendance: playerData.attendance
        },
        createdAt: serverTimestamp()
      });
      console.log(`✅ Joueur "${playerData.name}" ajouté à U19`);
    }
    console.log('');

    // 6. Créer les matchs
    console.log('🏆 Création des matchs...');
    
    // Matchs Seniors M
    for (let i = 0; i < 3; i++) {
      const matchData = matches[i];
      await addDoc(collection(db, `clubs/${clubId}/teams/${teamIds[0]}/matches`), {
        ...matchData,
        scoreHome: null,
        scoreAway: null,
        createdAt: serverTimestamp()
      });
      console.log(`✅ Match "${matchData.opponent}" créé pour Seniors M`);
    }

    // Matchs U19
    for (let i = 3; i < 5; i++) {
      const matchData = matches[i];
      await addDoc(collection(db, `clubs/${clubId}/teams/${teamIds[1]}/matches`), {
        ...matchData,
        scoreHome: null,
        scoreAway: null,
        createdAt: serverTimestamp()
      });
      console.log(`✅ Match "${matchData.opponent}" créé pour U19`);
    }
    console.log('');

    // 7. Résumé
    console.log('🎉 SEED TERMINÉ AVEC SUCCÈS !\n');
    console.log('📊 Résumé:');
    console.log(`   - 1 utilisateur créé`);
    console.log(`   - 1 club créé (${clubData.name})`);
    console.log(`   - ${teams.length} équipes créées`);
    console.log(`   - ${players.length} joueurs créés`);
    console.log(`   - ${matches.length} matchs créés`);
    console.log('');
    console.log('✅ Vous pouvez maintenant vous connecter et voir toutes les données !');

  } catch (error) {
    console.error('❌ Erreur pendant le seed:', error);
    throw error;
  }
}

// ============================================
// 🎬 EXÉCUTION
// ============================================

seedDatabase()
  .then(() => {
    console.log('\n✨ Script terminé avec succès !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erreur fatale:', error);
    process.exit(1);
  });