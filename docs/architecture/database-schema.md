# 🗄️ Schéma de Base de Données - TeamSphere

## Vue d'ensemble

TeamSphere utilise **Firestore** (base NoSQL) avec les collections suivantes :
```
firestore/
├── users/
├── clubs/
├── memberships/
├── teams/
├── players/
├── matches/
├── attendances/
├── exercises/
└── messages/
```

## Collections détaillées

### 1. Users (Utilisateurs)

Collection : `users`
```javascript
{
  id: "user123",                    // UID Firebase Auth
  email: "coach@example.com",
  displayName: "Jean Dupont",
  firstName: "Jean",
  lastName: "Dupont",
  photoURL: "https://...",
  phone: "+33612345678",
  createdAt: "2025-01-15T10:00:00Z",
  updatedAt: "2025-01-20T15:30:00Z"
}
```

**Indexes** :
- `email` (unique via Firebase Auth)

---

### 2. Clubs

Collection : `clubs`
```javascript
{
  id: "club456",
  name: "Rugby Club Giffois",
  sport: "rugby",                   // rugby, football, basketball...
  city: "Gif-sur-Yvette",
  country: "France",
  description: "Club de rugby...",
  logoURL: "https://...",
  address: "1 Rue du Stade",
  zipCode: "91190",
  phone: "+33169123456",
  email: "contact@rcgiffois.fr",
  website: "https://rcgiffois.fr",
  createdBy: "user123",
  createdAt: "2025-01-10T09:00:00Z",
  settings: {
    allowPublicView: true,
    requireApproval: false
  }
}
```

**Indexes** :
- `createdBy`
- `sport`
- Composite: `sport + city`

---

### 3. Memberships (Appartenances)

Collection : `memberships`
```javascript
{
  id: "membership789",
  userId: "user123",
  clubId: "club456",
  role: "coach",                    // admin, coach, player, viewer
  status: "active",                 // active, pending, suspended
  joinedAt: "2025-01-15T10:00:00Z",
  invitedBy: "user999",
  invitedAt: "2025-01-14T16:00:00Z"
}
```

**Indexes** :
- `userId`
- `clubId`
- Composite: `userId + clubId` (unique)
- Composite: `clubId + role`

---

### 4. Teams (Équipes)

Collection : `teams`
```javascript
{
  id: "team101",
  clubId: "club456",
  name: "Seniors",
  category: "seniors",              // seniors, u18, u16, u14...
  season: "2024-2025",
  gender: "male",                   // male, female, mixed
  ageGroup: "adult",
  coaches: ["user123", "user456"],  // Array de userIds
  captainId: "player789",
  photoURL: "https://...",
  description: "Équipe senior...",
  createdAt: "2025-01-11T10:00:00Z",
  settings: {
    maxPlayers: 30,
    autoNotifications: true
  }
}
```

**Indexes** :
- `clubId`
- Composite: `clubId + season`
- Composite: `clubId + category`

---

### 5. Players (Joueurs)

Collection : `players`
```javascript
{
  id: "player789",
  clubId: "club456",
  teamId: "team101",
  userId: "user999",                // Si le joueur a un compte
  firstName: "Pierre",
  lastName: "Martin",
  dateOfBirth: "2000-03-15",
  age: 24,
  position: "centre",               // Poste spécifique au sport
  number: 12,                       // Numéro de maillot
  photoURL: "https://...",
  height: 180,                      // cm
  weight: 85,                       // kg
  email: "pierre.martin@example.com",
  phone: "+33612345678",
  address: "10 Rue...",
  emergencyContact: {
    name: "Marie Martin",
    phone: "+33698765432",
    relation: "Mère"
  },
  medicalInfo: {
    bloodType: "A+",
    allergies: ["Aucune"],
    medications: [],
    notes: ""
  },
  stats: {
    matchesPlayed: 15,
    tries: 8,
    conversions: 0,
    penalties: 0,
    tackles: 45,
    yellowCards: 1,
    redCards: 0
  },
  status: "active",                 // active, injured, suspended
  joinedAt: "2024-09-01T10:00:00Z",
  createdAt: "2024-09-01T10:00:00Z"
}
```

**Indexes** :
- `clubId`
- `teamId`
- `userId`
- Composite: `clubId + teamId`
- Composite: `teamId + position`

---

### 6. Matches

Collection : `matches`
```javascript
{
  id: "match202",
  teamId: "team101",
  clubId: "club456",
  opponent: "AS Palaiseau",
  date: "2025-02-15T15:00:00Z",
  location: "home",                 // home, away
  venue: "Stade Municipal",
  address: "1 Rue du Stade, Gif-sur-Yvette",
  type: "championship",             // championship, friendly, cup
  competition: "Championnat Régional",
  status: "scheduled",              // scheduled, ongoing, finished, cancelled
  homeScore: null,
  awayScore: null,
  lineup: {
    starters: ["player789", "player101"],
    substitutes: ["player202"]
  },
  stats: {
    tries: {
      "player789": 2,
      "player101": 1
    },
    conversions: {},
    penalties: {},
    yellowCards: [],
    redCards: []
  },
  notes: "Match important...",
  createdAt: "2025-01-20T10:00:00Z",
  updatedAt: "2025-02-15T17:00:00Z"
}
```

**Indexes** :
- `teamId`
- `clubId`
- Composite: `teamId + date` (desc)
- Composite: `teamId + status`

---

### 7. Attendances (Présences)

Collection : `attendances`
```javascript
{
  id: "attendance303",
  teamId: "team101",
  playerId: "player789",
  date: "2025-02-10",
  type: "training",                 // training, match
  status: "present",                // present, absent, late, injured, excused
  matchId: null,                    // Si type === "match"
  notes: "",
  recordedBy: "user123",
  recordedAt: "2025-02-10T18:30:00Z"
}
```

**Indexes** :
- `teamId`
- `playerId`
- Composite: `playerId + date`
- Composite: `teamId + date`
- Composite: `teamId + type`

---

### 8. Exercises (Exercices)

Collection : `exercises`
```javascript
{
  id: "exercise404",
  clubId: "club456",                // null si public
  name: "Touche offensive",
  description: "Exercice de touche...",
  category: "tactical",             // technical, tactical, physical
  difficulty: "intermediate",       // beginner, intermediate, advanced
  duration: 20,                     // minutes
  players: "8-15",
  material: ["Ballons", "Plots", "Coupelles"],
  objectives: ["Précision", "Coordination"],
  instructions: "1. Former deux lignes...",
  diagramURL: "https://...",
  videoURL: "https://youtube.com/...",
  isPublic: false,
  createdBy: "user123",
  createdAt: "2025-01-18T14:00:00Z",
  usageCount: 12
}
```

**Indexes** :
- `clubId`
- `category`
- `difficulty`
- Composite: `category + difficulty`

---

### 9. Messages

Collection : `messages`
```javascript
{
  id: "message505",
  teamId: "team101",
  clubId: "club456",
  senderId: "user123",
  senderName: "Coach Jean",
  subject: "Match de samedi",
  content: "N'oubliez pas...",
  recipients: ["player789", "player101"],  // Array de playerIds ou "all"
  type: "announcement",             // announcement, reminder, poll
  priority: "normal",               // low, normal, high, urgent
  attachments: [],
  poll: {                           // Si type === "poll"
    question: "Disponible samedi ?",
    options: ["Oui", "Non", "Peut-être"],
    responses: {
      "player789": "Oui",
      "player101": "Peut-être"
    }
  },
  sentAt: "2025-02-12T10:00:00Z",
  readBy: ["player789"]
}
```

**Indexes** :
- `teamId`
- `clubId`
- `senderId`
- Composite: `teamId + sentAt` (desc)

---

## Relations entre collections

### Diagramme de relations
```
User ──────┬─────── Membership ────── Club
           │                           │
           │                           ├─── Team
           │                           │     │
           └─────── Player ────────────┘     ├─── Match
                     │                       │
                     └─── Attendance ────────┘
                           Message ──────────┘
                           Exercise
```

### Cardinalités

- **User ↔ Membership** : 1 à N (un user, plusieurs clubs)
- **Club ↔ Membership** : 1 à N (un club, plusieurs membres)
- **Club ↔ Team** : 1 à N (un club, plusieurs équipes)
- **Team ↔ Player** : 1 à N (une équipe, plusieurs joueurs)
- **Team ↔ Match** : 1 à N (une équipe, plusieurs matchs)
- **Player ↔ Attendance** : 1 à N (un joueur, plusieurs présences)

---

## Contraintes et validations

### Règles métier

1. **Unicité** :
   - Un user ne peut avoir qu'un seul membership par club
   - Un joueur ne peut être dans qu'une seule équipe par club

2. **Cascade** :
   - Suppression d'un club → supprime teams, players, matches
   - Suppression d'une équipe → déplace/supprime players
   - Suppression d'un user → anonymise les données

3. **Validation** :
   - Email valide
   - Date de naissance < aujourd'hui
   - Numéro de maillot unique dans l'équipe
   - Score ≥ 0

---

## Indexes Firestore requis

### Création via Firebase Console ou CLI
```javascript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "players",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "clubId", "order": "ASCENDING" },
        { "fieldPath": "teamId", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "matches",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "teamId", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "attendances",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "teamId", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "memberships",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "clubId", "order": "ASCENDING" },
        { "fieldPath": "role", "order": "ASCENDING" }
      ]
    }
  ]
}
```

---

## Migration et Évolutions

### Version 1.0 → 1.1

Ajout de champs :
- `players.stats.assists`
- `matches.weather`
- `clubs.settings.timezone`

### Scripts de migration
```javascript
// migrations/v1.1.js
const migratePlayersStats = async () => {
  const playersSnap = await getDocs(collection(db, 'players'));
  
  for (const doc of playersSnap.docs) {
    await updateDoc(doc.ref, {
      'stats.assists': 0
    });
  }
};
```

---

## Optimisations

### Dénormalisation stratégique

Pour les performances, certaines données sont dupliquées :
```javascript
// Dans Match, on stocke le nom de l'équipe
{
  teamId: "team101",
  teamName: "Seniors"  // Dupliqué de teams.name
}

// Dans Player, on stocke le nom du club
{
  clubId: "club456",
  clubName: "RC Giffois"  // Dupliqué de clubs.name
}
```

### Agrégations

Collections d'agrégations pour éviter les comptages :
```javascript
// Collection : team_stats
{
  teamId: "team101",
  season: "2024-2025",
  totalPlayers: 25,
  matchesPlayed: 15,
  matchesWon: 10,
  matchesLost: 5,
  totalTries: 45,
  updatedAt: "2025-02-15T18:00:00Z"
}
```

---

## Sauvegarde et Restauration

### Export quotidien
```bash
gcloud firestore export gs://backup-bucket/$(date +%Y%m%d)
```

### Import
```bash
gcloud firestore import gs://backup-bucket/20250215
```

---

## Ressources

- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)
- [Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Security Rules](./security-rules.md)