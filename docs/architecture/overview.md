# 🏗️ Architecture TeamSphere

## Vue d'ensemble

TeamSphere est construit avec une architecture moderne et scalable :

- **Frontend** : React 18 + Vite
- **Backend** : Firebase (Firestore + Auth + Hosting)
- **State Management** : Context API
- **Styling** : Tailwind CSS
- **Routing** : React Router

## Architecture Multi-tenant

TeamSphere supporte plusieurs clubs pour un même utilisateur :
```
User (Raphaël)
  ├── Club A (Rugby Giffois) - Role: Admin
  │   ├── Équipe Seniors - Role: Admin
  │   └── Équipe Juniors - Role: Admin
  └── Club B (AS Palaiseau) - Role: Coach
      └── Équipe U18 - Role: Coach
```

### Principe de base

1. Un **User** peut être membre de plusieurs **Clubs**
2. Chaque **Club** a plusieurs **Teams**
3. Chaque **Team** a plusieurs **Players**
4. Les **Matchs** sont liés à une équipe

## Structure Firestore
```
users/
  {userId}/
    - email
    - displayName
    - createdAt

clubs/
  {clubId}/
    - name
    - sport
    - city
    - createdAt
    - createdBy

memberships/
  {membershipId}/
    - userId
    - clubId
    - role (admin, coach, player, viewer)
    - createdAt

teams/
  {teamId}/
    - clubId
    - name
    - category
    - season
    - createdAt

players/
  {playerId}/
    - clubId
    - teamId
    - firstName
    - lastName
    - dateOfBirth
    - position
    - number

matches/
  {matchId}/
    - teamId
    - opponent
    - date
    - location
    - homeScore
    - awayScore
    - status
```

## Flux de données

### 1. Connexion utilisateur
```
Login → Firebase Auth → Get User Profile → Load Memberships → Display Clubs
```

### 2. Sélection d'un club
```
Select Club → Load Teams → Display Dashboard
```

### 3. Sélection d'une équipe
```
Select Team → Load Players + Matches → Display Team View
```

## Composants principaux

### Context API

**AppContext** : State global de l'application
```javascript
{
  user: User | null,
  currentClub: Club | null,
  currentTeam: Team | null,
  clubs: Club[],
  teams: Team[],
  players: Player[],
  matches: Match[]
}
```

### Services Firebase

- **authService** : Authentification (login, register, logout)
- **userService** : Gestion profils utilisateurs
- **clubService** : CRUD clubs
- **membershipService** : Gestion des appartenances
- **teamService** : CRUD équipes
- **playerService** : CRUD joueurs
- **matchService** : CRUD matchs

## Sécurité

### Firestore Security Rules

Les règles garantissent que :

1. Un utilisateur ne peut voir que les clubs dont il est membre
2. Seuls les admins peuvent modifier les paramètres du club
3. Les coachs peuvent gérer leurs équipes
4. Les joueurs peuvent voir uniquement leur équipe

### Exemple de règle
```javascript
// Les membres peuvent lire leur club
match /clubs/{clubId} {
  allow read: if isMember(clubId);
  allow write: if isAdmin(clubId);
}
```

## Performance

### Optimisations

1. **Pagination** : Chargement par lots (20 items)
2. **Cache** : Utilisation du cache Firestore
3. **Indexes** : Indexes composites pour les requêtes complexes
4. **Lazy Loading** : Chargement à la demande des composants

### Indexes Firestore requis
```
Collection: players
Fields: clubId (Ascending), teamId (Ascending)

Collection: matches
Fields: teamId (Ascending), date (Descending)
```

## Évolutions futures

- **Offline support** : Synchronisation hors ligne
- **Real-time updates** : WebSockets pour les mises à jour en temps réel
- **Microservices** : Séparation des services (stats, notifications)
- **CDN** : Distribution des assets statiques