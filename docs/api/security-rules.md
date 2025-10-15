🔒 Firestore Security Rules - TeamSphere

## Vue d'ensemble

Les Security Rules garantissent que :
- Les utilisateurs ne peuvent accéder qu'à leurs données
- Les rôles sont respectés (admin, coach, player)
- Les données sont validées avant écriture

## Règles complètes

### firestore.rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Fonctions helper
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isMember(clubId) {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/memberships/$(request.auth.uid + '_' + clubId));
    }
    
    function isAdmin(clubId) {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/memberships/$(request.auth.uid + '_' + clubId)).data.role == 'admin';
    }
    
    function isCoachOrAdmin(clubId) {
      let membership = get(/databases/$(database)/documents/memberships/$(request.auth.uid + '_' + clubId));
      return isAuthenticated() && 
        (membership.data.role == 'admin' || membership.data.role == 'coach');
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);
      allow delete: if isOwner(userId);
    }
    
    // Clubs collection
    match /clubs/{clubId} {
      allow read: if isMember(clubId);
      allow create: if isAuthenticated();
      allow update: if isAdmin(clubId);
      allow delete: if isAdmin(clubId);
    }
    
    // Memberships collection
    match /memberships/{membershipId} {
      allow read: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || 
         isAdmin(resource.data.clubId));
      allow create: if isAuthenticated() && 
        (request.resource.data.userId == request.auth.uid || 
         isAdmin(request.resource.data.clubId));
      allow update: if isAdmin(resource.data.clubId);
      allow delete: if isAdmin(resource.data.clubId);
    }
    
    // Teams collection
    match /teams/{teamId} {
      allow read: if isMember(resource.data.clubId);
      allow create: if isCoachOrAdmin(request.resource.data.clubId);
      allow update: if isCoachOrAdmin(resource.data.clubId);
      allow delete: if isAdmin(resource.data.clubId);
    }
    
    // Players collection
    match /players/{playerId} {
      allow read: if isMember(resource.data.clubId);
      allow create: if isCoachOrAdmin(request.resource.data.clubId);
      allow update: if isCoachOrAdmin(resource.data.clubId);
      allow delete: if isCoachOrAdmin(resource.data.clubId);
    }
    
    // Matches collection
    match /matches/{matchId} {
      allow read: if isMember(get(/databases/$(database)/documents/teams/$(resource.data.teamId)).data.clubId);
      allow create: if isCoachOrAdmin(
        get(/databases/$(database)/documents/teams/$(request.resource.data.teamId)).data.clubId
      );
      allow update: if isCoachOrAdmin(
        get(/databases/$(database)/documents/teams/$(resource.data.teamId)).data.clubId
      );
      allow delete: if isCoachOrAdmin(
        get(/databases/$(database)/documents/teams/$(resource.data.teamId)).data.clubId
      );
    }
  }
}
```

## Explication des règles

### 1. Users (Profils utilisateurs)
```javascript
match /users/{userId} {
  allow read: if isAuthenticated();
  allow create: if isOwner(userId);
  allow update: if isOwner(userId);
  allow delete: if isOwner(userId);
}
```

- **Read** : Tous les utilisateurs authentifiés peuvent lire les profils
- **Create/Update/Delete** : Seulement le propriétaire du profil

### 2. Clubs
```javascript
match /clubs/{clubId} {
  allow read: if isMember(clubId);
  allow create: if isAuthenticated();
  allow update: if isAdmin(clubId);
  allow delete: if isAdmin(clubId);
}
```

- **Read** : Seulement les membres du club
- **Create** : N'importe quel utilisateur authentifié
- **Update/Delete** : Seulement les admins du club

### 3. Memberships (Appartenances)
```javascript
match /memberships/{membershipId} {
  allow read: if isAuthenticated() && 
    (resource.data.userId == request.auth.uid || 
     isAdmin(resource.data.clubId));
  allow create: if isAuthenticated() && 
    (request.resource.data.userId == request.auth.uid || 
     isAdmin(request.resource.data.clubId));
  allow update: if isAdmin(resource.data.clubId);
  allow delete: if isAdmin(resource.data.clubId);
}
```

- **Read** : L'utilisateur concerné ou les admins
- **Create** : Auto-inscription ou invitation par admin
- **Update/Delete** : Seulement les admins

### 4. Teams (Équipes)
```javascript
match /teams/{teamId} {
  allow read: if isMember(resource.data.clubId);
  allow create: if isCoachOrAdmin(request.resource.data.clubId);
  allow update: if isCoachOrAdmin(resource.data.clubId);
  allow delete: if isAdmin(resource.data.clubId);
}
```

- **Read** : Tous les membres du club
- **Create/Update** : Coachs et admins
- **Delete** : Seulement admins

### 5. Players (Joueurs)
```javascript
match /players/{playerId} {
  allow read: if isMember(resource.data.clubId);
  allow create: if isCoachOrAdmin(request.resource.data.clubId);
  allow update: if isCoachOrAdmin(resource.data.clubId);
  allow delete: if isCoachOrAdmin(resource.data.clubId);
}
```

- **Read** : Tous les membres du club
- **Create/Update/Delete** : Coachs et admins

### 6. Matches
```javascript
match /matches/{matchId} {
  allow read: if isMember(get(/databases/$(database)/documents/teams/$(resource.data.teamId)).data.clubId);
  allow create: if isCoachOrAdmin(...);
  allow update: if isCoachOrAdmin(...);
  allow delete: if isCoachOrAdmin(...);
}
```

- **Read** : Membres du club de l'équipe
- **Create/Update/Delete** : Coachs et admins

## Déploiement des règles

### 1. Installation Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Connexion
```bash
firebase login
```

### 3. Initialisation
```bash
firebase init firestore
```

Sélectionner :
- Firestore Rules : `firestore.rules`
- Firestore Indexes : `firestore.indexes.json`

### 4. Déployer
```bash
firebase deploy --only firestore:rules
```

## Validation des données

### Ajouter des validations
```javascript
// Exemple : valider qu'un email est bien formaté
match /users/{userId} {
  allow create: if isOwner(userId) &&
    request.resource.data.email.matches('.*@.*\\..*');
}

// Exemple : limiter la longueur d'un nom
match /clubs/{clubId} {
  allow create: if isAuthenticated() &&
    request.resource.data.name.size() >= 3 &&
    request.resource.data.name.size() <= 50;
}

// Exemple : valider qu'une date est dans le futur
match /matches/{matchId} {
  allow create: if isCoachOrAdmin(...) &&
    request.resource.data.date > request.time;
}
```

## Tests des règles

### Simulateur Firebase

1. Aller sur Firebase Console
2. Firestore Database > Rules
3. Cliquer sur "Rules Playground"
4. Tester les scénarios

### Tests unitaires
```javascript
// À venir : Tests Jest pour les Security Rules
```

## Bonnes pratiques

1. **Principe du moindre privilège** : Donner le minimum de permissions
2. **Valider les données** : Ne jamais faire confiance au client
3. **Tester régulièrement** : Utiliser le simulateur
4. **Documenter les règles** : Expliquer la logique
5. **Éviter les règles trop complexes** : Limiter les `get()` imbriqués

## Erreurs courantes

### Permission denied
```javascript
// ❌ Mauvais
allow read: if true; // Trop permissif

// ✅ Bon
allow read: if isAuthenticated() && isMember(resource.data.clubId);
```

### Trop de reads
```javascript
// ❌ Mauvais (trop de get())
allow read: if get(...).data.x && get(...).data.y;

// ✅ Bon (une seule lecture)
allow read: if get(...).data.isAllowed;
```

## Ressources

- [Documentation Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Guide des bonnes pratiques](https://firebase.google.com/docs/rules/rules-and-auth)