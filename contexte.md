# Contexte TeamSphere - État Actuel du Projet

## Résumé du Projet

**TeamSphere** est une application de gestion d'équipes sportives construite avec React, Firebase et Tailwind CSS. L'application permet aux entraîneurs et gestionnaires de clubs de gérer leurs équipes, joueurs, matchs et statistiques. **Depuis la version 1.3.0, TeamSphere est disponible comme application mobile native sur iOS et Android grâce à Capacitor. La version 1.3.1 a apporté une page de login professionnelle complète, et la version 1.3.2 corrige la fonction de déconnexion.**

**Version actuelle** : 1.3.2  
**Date de mise à jour** : 3 novembre 2025

---

## 📊 État Actuel du Projet

### ✅ Fonctionnalités Complétées

**Version 1.3.2 (Actuelle) - Corrections Fonction Logout** 🔧
- ✅ **Correction redirection déconnexion**
  - Plus de passage par l'écran d'onboarding
  - Redirection directe vers `/login`
  - Correction dans `ProtectedRoute` (`/` → `/login`)
- ✅ **Correction Sidebar.jsx**
  - Utilisation directe de `logout` depuis `useApp()`
  - Suppression de l'appel via `authService`
  - Fonction `handleLogout` simplifiée
- ✅ **Amélioration AppContext.jsx**
  - Utilisation de `window.location.href` au lieu de `useNavigate()`
  - Évite l'erreur "must be used in Router context"
  - Nettoyage garanti de tous les états
- ✅ **Correction noms de fonctions services**
  - `teamService.getAll()` au lieu de `getTeamsByClub()`
  - `playerService.getAll()` au lieu de `getPlayersByTeam()`
  - `matchService.getAll()` au lieu de `getMatchesByTeam()`
  - Ajout gestion d'erreur try/catch
- ✅ **Tests complets effectués**
  - Déconnexion depuis Sidebar ✅
  - Déconnexion depuis Topbar ✅
  - Protection des routes ✅
  - Nettoyage des états ✅
  - Aucune erreur console ✅

**Version 1.3.1 - Page de Login Professionnelle** 🔐
- ✅ **Page de login moderne et responsive**
  - Design professionnel avec gradient
  - Formulaire email/password avec validation
  - Toggle visibilité du mot de passe
  - États de chargement animés
  - Messages d'erreur clairs
- ✅ **Service d'authentification Firebase complet**
  - Login email/password
  - Google OAuth
  - Apple Sign In
  - Reset password
  - Gestion des tokens
  - 15+ codes d'erreur traduits
- ✅ **Context d'authentification React**
  - État global utilisateur
  - Hook useAuth() personnalisé
  - Observer Firebase Auth
  - Gestion loading/error
- ✅ **Routes protégées et publiques**
  - ProtectedRoute pour pages privées
  - PublicRoute pour pages publiques
  - Redirections automatiques
  - Conservation de la navigation
- ✅ **Configuration router complète**
  - Routes publiques (/login, /signup, /)
  - Routes protégées (/dashboard/*)
  - Page 404
  - Layout avec sidebar
- ✅ **Documentation exhaustive** (4 guides, 1100+ lignes)
  - Guide d'utilisation LoginPage
  - Guide d'intégration complet
  - Checklist d'installation
  - Configuration Firebase

**Version 1.3.0 - Application Mobile Native** 📱
- ✅ **Intégration Capacitor 6.0 complète**
- ✅ **Application mobile native iOS et Android**
- ✅ **Projets natifs Android Studio et Xcode générés**
- ✅ **Plugins natifs installés et configurés**
  - Status Bar (barre de statut personnalisée)
  - Splash Screen (écran de démarrage)
  - Keyboard (gestion intelligente du clavier)
  - App (événements système et bouton retour)
- ✅ **Utilitaires de détection de plateforme**
- ✅ **Optimisations UI mobile** (safe areas, touch gestures)
- ✅ **App.jsx optimisé pour mobile**
- ✅ **Scripts npm pour développement mobile**
- ✅ **Documentation mobile complète** (3 guides)
- ✅ **Wireframes mobile interactifs**

**Version 1.2.0**
- ✅ Authentification Firebase complète
- ✅ Onboarding wizard en 4 étapes
- ✅ Dashboard avec métriques en temps réel
- ✅ Gestion des joueurs (CRUD complet)
- ✅ Page Calendrier avec deux vues (semaine/liste)
- ✅ Service matchService avec 10 fonctions
- ✅ Gestion des matchs (création, affichage, scores)
- ✅ Composant AddMatchModal fonctionnel
- ✅ **Module Statistiques complet avec menu déroulant**
- ✅ **5 pages statistiques (Overview, Players, Events, Rankings, Charts)**
- ✅ **Composants de statistiques réutilisables**
- ✅ **Graphiques Recharts (line, bar, pie)**
- ✅ **Calculs automatiques des métriques**
- ✅ Architecture multi-tenant (clubs/équipes)
- ✅ Navigation et routing complets
- ✅ Déploiement Vercel fonctionnel

### 🚧 Fonctionnalités En Cours / À Améliorer

**Authentification (prochaine v1.3.2)**
- [ ] Page Signup complète avec design similaire
- [ ] Page Forgot Password avec envoi email
- [ ] Vérification email après inscription
- [ ] 2FA (authentification à deux facteurs)
- [ ] "Remember me" fonctionnel
- [ ] Captcha après X tentatives échouées
- [ ] Logs de connexion dans Firestore
- [ ] Dashboard analytics connexions

**Mobile (améliorations v1.4.0)**
- [ ] Génération icônes app personnalisées
- [ ] Splash screen avec branding TeamSphere
- [ ] Tests sur devices réels
- [ ] Configuration signing Android (keystore)
- [ ] Configuration provisioning iOS (Apple Developer)
- [ ] Publication Play Store
- [ ] Publication App Store
- [ ] Push notifications pour matchs
- [ ] Caméra pour photos joueurs
- [ ] Géolocalisation pour terrains
- [ ] Mode offline complet
- [ ] Synchronisation background

**Statistiques (améliorations futures)**
- [ ] Export des statistiques (PDF/Excel)
- [ ] Statistiques par compétition
- [ ] Comparaison entre saisons
- [ ] Statistiques détaillées par joueur (buts, passes, cartons)
- [ ] Graphiques avancés (heat maps, radar)
- [ ] Analyse tactique (formations, zones)

**Calendrier**
- [ ] Édition de matchs existants
- [ ] Suppression de matchs
- [ ] Filtres par compétition

**Général**
- [ ] Mode sombre
- [ ] Notifications push web
- [ ] Messagerie interne
- [ ] Exports de données

---

## 🗃️ Architecture Technique

### Stack Technique
```
Frontend:
- React 18.3.1 + Vite 5.2.11
- Tailwind CSS 3.4.3
- React Router DOM 6.23.0

Backend:
- Firebase (Auth + Firestore) 10.12.0

Mobile: ✨
- Capacitor 6.0.0
- Android Studio / Xcode

Graphiques:
- Recharts 2.10.0

Build:
- ESBuild (Vite)
- Code splitting optimisé
```

### Structure du Projet v1.3.1

```
teamsphere/
├── android/                           # Projet Android Studio ✨
├── ios/                               # Projet Xcode ✨
├── resources/                         # Icônes et splash ✨
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── ui/                        # Composants UI réutilisables
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Modal.jsx
│   │   ├── layout/                    # Layout et navigation
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── TopBar.jsx
│   │   ├── calendar/                  # Composants calendrier
│   │   │   ├── CalendarWeekView.jsx
│   │   │   └── AddMatchModal.jsx
│   │   ├── stats/                     # Composants statistiques
│   │   │   ├── StatsOverview.jsx
│   │   │   ├── PerformanceChart.jsx
│   │   │   ├── ComparisonStats.jsx
│   │   │   ├── PlayersStats.jsx
│   │   │   └── MatchesTable.jsx
│   │   ├── onboarding/                # Wizard onboarding
│   │   │   ├── OnboardingWizard.jsx
│   │   │   ├── WelcomeScreen.jsx
│   │   │   └── steps/
│   │   └── router/                    # Routes ✨ NOUVEAU v1.3.1
│   │       └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx              # ✨ NOUVEAU v1.3.1
│   │   ├── SignupPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── PlayersPage.jsx
│   │   ├── CalendarPage.jsx
│   │   └── statistics/                # 5 pages stats
│   │       ├── OverviewPage.jsx
│   │       ├── PlayerStatsPage.jsx
│   │       ├── EventStatsPage.jsx
│   │       ├── RankingsPage.jsx
│   │       └── ChartsPage.jsx
│   ├── services/
│   │   ├── authService.js             # ✨ ENRICHI v1.3.1
│   │   ├── userService.js
│   │   ├── clubService.js
│   │   ├── teamService.js
│   │   ├── playerService.js
│   │   └── matchService.js
│   ├── context/
│   │   ├── AppContext.jsx
│   │   └── AuthContext.jsx            # ✨ NOUVEAU v1.3.1
│   ├── utils/                         # ✨ Mobile utils
│   │   ├── platform.ts
│   │   ├── keyboard.ts
│   │   └── backButton.ts
│   ├── config/
│   │   └── firebase.js
│   ├── router/                        # ✨ NOUVEAU v1.3.1
│   │   └── index.jsx
│   ├── App.jsx                        # ✨ MODIFIÉ v1.3.1
│   ├── main.jsx
│   └── index.css
├── capacitor.config.ts                # ✨ Mobile config
├── mobile.css                         # ✨ Mobile styles
├── .env                               # Variables d'environnement
├── vite.config.js
└── package.json
```

### Architecture Authentification v1.3.1 ✨

```
┌─────────────────────────────────────────────────────┐
│                    App.jsx                          │
│              (AuthProvider wrapper)                 │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│              AuthContext.jsx                        │
│  - État global utilisateur                          │
│  - Hook useAuth()                                   │
│  - Observer Firebase Auth                           │
│  - Méthodes: login, signup, logout                  │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│            authService.js                           │
│  - login(email, password)                           │
│  - loginWithGoogle()                                │
│  - loginWithApple()                                 │
│  - signup(email, password, displayName)             │
│  - logout()                                         │
│  - resetPassword(email)                             │
│  - getCurrentUser()                                 │
│  - onAuthStateChanged(callback)                     │
│  - getIdToken()                                     │
│  - refreshToken()                                   │
│  - getErrorMessage(code)                            │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│           Firebase Authentication                   │
│  - Email/Password Provider                          │
│  - Google OAuth Provider                            │
│  - Apple OAuth Provider                             │
│  - JWT Tokens                                       │
│  - Security Rules                                   │
└─────────────────────────────────────────────────────┘
```

### Flux d'Authentification

```
1. USER ACTION
   └─> Clic sur "Login" (LoginPage.jsx)
       │
       ▼
2. VALIDATION
   └─> Validation formulaire côté client
       │
       ▼
3. CONTEXT
   └─> useAuth().login(email, password)
       │
       ▼
4. SERVICE
   └─> authService.login(email, password)
       │
       ▼
5. FIREBASE
   └─> signInWithEmailAndPassword(auth, email, password)
       │
       ▼
6. RESPONSE
   ├─> Success → User object
   │   │
   │   ▼
   │   7. AUTH OBSERVER
   │      └─> onAuthStateChanged() détecte changement
   │          │
   │          ▼
   │          8. CONTEXT UPDATE
   │             └─> setUser(userData)
   │                 │
   │                 ▼
   │                 9. UI UPDATE
   │                    └─> Navigate to /dashboard
   │
   └─> Error → Error object
       │
       ▼
       10. ERROR HANDLING
          └─> getErrorMessage(error.code)
              │
              ▼
              11. UI FEEDBACK
                 └─> Display error message
```

### Routes Configuration v1.3.1

```
Routes Publiques (PublicRoute):
├── /                          → LandingPage
├── /login                     → LoginPage ✨ NOUVEAU
├── /signup                    → SignupPage
└── /forgot-password           → ForgotPasswordPage (à créer)

Routes Protégées (ProtectedRoute):
└── /dashboard                 → DashboardLayout
    ├── (index)                → Dashboard
    ├── /players               → PlayersPage
    ├── /calendar              → CalendarPage
    ├── /statistics            → Menu déroulant
    │   ├── /overview          → OverviewPage
    │   ├── /players           → PlayerStatsPage
    │   ├── /events            → EventStatsPage
    │   ├── /rankings          → RankingsPage
    │   └── /charts            → ChartsPage
    ├── /settings              → SettingsPage
    └── /profile               → ProfilePage

Autres:
└── *                          → NotFoundPage (404)
```

### Firebase Structure

```
Firestore Collections:
├── users/
│   └── {userId}/
│       ├── email: string
│       ├── displayName: string
│       ├── photoURL: string
│       ├── createdAt: timestamp
│       └── lastLoginAt: timestamp ✨ Utile pour analytics
│
├── clubs/
│   └── {clubId}/
│       ├── name: string
│       ├── sport: string
│       ├── city: string
│       ├── createdBy: string (userId)
│       └── createdAt: timestamp
│
├── memberships/
│   └── {membershipId}/
│       ├── userId: string
│       ├── clubId: string
│       ├── role: string (admin|coach|player|viewer)
│       └── createdAt: timestamp
│
├── teams/
│   └── {teamId}/
│       ├── clubId: string
│       ├── name: string
│       ├── category: string
│       └── season: string
│
├── players/
│   └── {playerId}/
│       ├── teamId: string
│       ├── firstName: string
│       ├── lastName: string
│       ├── position: string
│       └── number: number
│
└── matches/
    └── {matchId}/
        ├── teamId: string
        ├── opponent: string
        ├── date: timestamp
        ├── homeScore: number
        └── awayScore: number
```

---

## 🔐 Sécurité - Version 1.3.1

### Authentification Sécurisée

**Implémenté** ✅
- Validation côté client (email format, password length)
- Validation côté serveur (Firebase Auth)
- Hashing automatique des passwords (bcrypt via Firebase)
- Tokens JWT sécurisés
- HTTPS obligatoire en production
- Protection CSRF automatique (Firebase)
- Rate limiting automatique (Firebase)
- Messages d'erreur génériques (pas de leak d'info)
- Sessions sécurisées avec refresh tokens
- Cleanup automatique des listeners

**Codes d'Erreur Gérés** (15+)
```javascript
{
  'auth/invalid-email': 'L\'adresse email est invalide',
  'auth/user-disabled': 'Ce compte a été désactivé',
  'auth/user-not-found': 'Aucun compte ne correspond à cet email',
  'auth/wrong-password': 'Mot de passe incorrect',
  'auth/invalid-credential': 'Email ou mot de passe incorrect',
  'auth/email-already-in-use': 'Cet email est déjà utilisé',
  'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
  'auth/too-many-requests': 'Trop de tentatives. Veuillez réessayer plus tard',
  'auth/network-request-failed': 'Erreur de connexion. Vérifiez votre réseau',
  'auth/operation-not-allowed': 'Cette opération n\'est pas autorisée',
  'auth/popup-blocked': 'La popup a été bloquée par le navigateur',
  'auth/popup-closed-by-user': 'La connexion a été annulée',
  'auth/cancelled-popup-request': 'Une autre popup est déjà ouverte',
  'auth/invalid-action-code': 'Le lien est invalide ou a expiré',
  'auth/expired-action-code': 'Le lien a expiré'
}
```

**À Ajouter** (v1.3.2+)
- [ ] Captcha après 5 tentatives échouées
- [ ] Logs de connexion (IP, date, device)
- [ ] Notifications email connexion suspecte
- [ ] 2FA avec SMS ou authenticator app
- [ ] Limite tentatives par IP
- [ ] Blacklist IP malveillantes
- [ ] Session timeout configurable
- [ ] Force logout autres sessions

### Firebase Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Utilisateurs : lecture/écriture de son propre profil uniquement
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Clubs : membres peuvent lire, seul créateur peut modifier
    match /clubs/{clubId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
        && request.resource.data.createdBy == request.auth.uid;
      allow update, delete: if request.auth != null 
        && resource.data.createdBy == request.auth.uid;
    }
    
    // Memberships : lecture si membre, écriture si admin du club
    match /memberships/{membershipId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      // TODO: Vérifier rôle admin pour écriture
    }
    
    // Teams, Players, Matches : authentification requise
    match /{document=**} {
      allow read, write: if request.auth != null;
      // TODO: Affiner les permissions par rôle
    }
  }
}
```

---

## 📚 Documentation Projet

### Documentation Login v1.3.1 ✨

**Fichiers Créés**
1. `LOGIN_README.md` (7.7 KB, 200+ lignes)
   - Description fonctionnalités
   - Guide d'installation
   - Intégration Firebase Auth
   - Personnalisation
   - Tests manuels et tests unitaires
   - Métriques de performance
   - Checklist d'accessibilité
   - Troubleshooting complet

2. `INTEGRATION_GUIDE.md` (9.1 KB, 300+ lignes)
   - Installation étape par étape (6 phases)
   - Configuration Firebase Console
   - Variables d'environnement
   - Copie et organisation des fichiers
   - Création des pages complémentaires
   - Tests d'intégration
   - Personnalisation avancée
   - Dépannage détaillé

3. `CHECKLIST.md` (7.6 KB, 250+ lignes)
   - Checklist complète (30+ items)
   - Phase 1: Configuration initiale
   - Phase 2: Firebase Console
   - Phase 3: Copie des fichiers
   - Phase 4: Pages manquantes
   - Phase 5: Tests
   - Phase 6: Personnalisation
   - Sécurité checklist
   - Roadmap future

4. `FIREBASE_CONFIG.md` (10 KB, 350+ lignes)
   - Configuration firebase.js complète
   - Exemples .env et .env.example
   - Security Rules Firestore
   - Storage Rules
   - Scripts de déploiement
   - Firebase Emulators
   - Structure Firestore détaillée
   - Indexes Firestore

**Total Documentation Login**
- 4 fichiers markdown
- ~35 KB de documentation
- 1100+ lignes
- 50+ exemples de code
- Troubleshooting exhaustif

### Documentation Mobile v1.3.0

**Guides Créés**
1. `guide-transformation-mobile.md` (8000+ mots)
2. `guide-installation-capacitor.md` (10 étapes détaillées)
3. `react-vs-react-native-architecture.md` (comparaison)
4. `teamsphere-mobile-wireframes.html` (wireframes interactifs)

### Documentation Statistiques v1.2.0

**Guides Créés**
1. `README-MENU-STATISTIQUES.md` (vue d'ensemble)
2. `GUIDE-INSTALLATION-MENU.md` (installation détaillée)
3. `README-CORRECTIF.md` (bugs documentés)

**Total Documentation Projet**
- **11 fichiers de documentation**
- **~20000 lignes au total**
- **100+ exemples de code**
- **Wireframes interactifs**
- **Troubleshooting complet**

---

## 🚀 Roadmap Futur

### Version 1.3.2 - Authentification Complète
**Estimation** : 1-2 semaines

- [ ] Page Signup complète (similaire LoginPage)
- [ ] Page Forgot Password avec envoi email Firebase
- [ ] Page Reset Password (via email link)
- [ ] Vérification email après inscription
- [ ] Lien de vérification dans email
- [ ] Message "Vérifiez votre email"
- [ ] Resend verification email

### Version 1.4.0 - Mobile Polish
**Estimation** : 2-3 semaines

- [ ] Icônes app personnalisées (1024x1024)
- [ ] Splash screen avec branding TeamSphere
- [ ] Tests sur devices réels (Android/iOS)
- [ ] Configuration signing Android (keystore + Google Play Console)
- [ ] Configuration provisioning iOS (Apple Developer Account)
- [ ] Publication version beta Play Store
- [ ] Publication version beta App Store via TestFlight

### Version 1.5.0 - Features Natives Avancées
**Estimation** : 3-4 semaines

- [ ] Plugin Camera - Photos joueurs
- [ ] Plugin Push Notifications - Matchs/entraînements
- [ ] Plugin Geolocation - Localisation terrains
- [ ] Plugin Share - Partage résultats réseaux sociaux
- [ ] Plugin Preferences - Stockage local persistant
- [ ] Mode offline avec synchronisation
- [ ] Background sync Firebase

### Version 2.0.0 - Production & Analytics
**Estimation** : 4-6 semaines

- [ ] 2FA (SMS, Authenticator app)
- [ ] Analytics connexions/usage
- [ ] Logs détaillés (IP, device, browser)
- [ ] Dashboard admin analytics
- [ ] Rate limiting avancé
- [ ] Captcha intelligent
- [ ] Export données RGPD
- [ ] Mode sombre
- [ ] Internationalisation (i18n)
- [ ] Tests E2E complets
- [ ] CI/CD GitHub Actions
- [ ] Monitoring production (Sentry)
- [ ] Performance monitoring
- [ ] Publication publique stores

---

## 🎯 Prochaines Actions Recommandées

### Court Terme (1-2 semaines)

1. ~~**Intégrer la Page de Login**~~ ✅ Fait v1.3.1
   - ~~Copier les 8 fichiers fournis~~
   - ~~Configurer Firebase Console~~
   - ~~Tester email/password~~
   - ~~Tester Google OAuth~~
   - ~~Documenter pour l'équipe~~

2. ~~**Corriger Fonction Logout**~~ ✅ Fait v1.3.2
   - ~~Corriger redirection vers /login~~
   - ~~Corriger appel logout dans Sidebar~~
   - ~~Corriger noms fonctions services~~
   - ~~Tester déconnexion complète~~

3. **Créer Page Signup**
   - Dupliquer structure LoginPage
   - Adapter formulaire (+ displayName)
   - Intégrer authService.signup()
   - Ajouter terms & conditions
   - Tester création compte

4. **Créer Page Forgot Password**
   - Formulaire simple (email)
   - Intégrer authService.resetPassword()
   - Message de confirmation
   - Lien retour vers login

### Moyen Terme (3-4 semaines)

4. **Améliorer Mobile**
   - Générer icônes personnalisées
   - Créer splash screen branding
   - Tester sur devices réels
   - Corriger bugs trouvés

5. **Ajouter 2FA**
   - Rechercher plugin Capacitor
   - Implémenter SMS verification
   - Ou Authenticator app (Google, Microsoft)
   - Tester workflow complet

6. **Analytics & Logs**
   - Collection `loginLogs` Firestore
   - Dashboard admin avec stats
   - Graphiques connexions/jour
   - Détection anomalies

### Long Terme (2-3 mois)

7. **Publication Stores**
   - Compte Google Play Developer ($25)
   - Compte Apple Developer ($99/an)
   - Assets stores (screenshots, description)
   - Signing et build production
   - Soumission review
   - Publication publique

8. **Features Natives**
   - Camera pour photos
   - Push notifications
   - Géolocalisation
   - Mode offline
   - Background sync

9. **Monitoring Production**
   - Sentry pour crash reporting
   - Firebase Analytics
   - Performance monitoring
   - User behavior analytics
   - A/B testing

---

## 📞 Support & Ressources

### Documentation Officielle
- [React Docs](https://react.dev)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Capacitor Docs](https://capacitorjs.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

### Repositories GitHub
- TeamSphere: https://github.com/rboui/teamsphere (private)

### Outils Développement
- **IDE** : VS Code
- **Git GUI** : Git GUI (Windows)
- **Émulateurs** : Android Studio, Xcode Simulator
- **Testing** : React Testing Library
- **CI/CD** : GitHub Actions (à configurer)

### Contact
- **Développeur Principal** : Raphaël
- **Email** : (à définir)
- **Slack/Discord** : (à définir)

---

## 📝 Notes Importantes

### Variables d'Environnement ⚠️
Ne jamais commiter le fichier `.env` !
Toujours utiliser `.env.example` pour la documentation.

```bash
# .gitignore
.env
.env.local
.env.production
```

### Firebase Credentials ⚠️
Les credentials Firebase sont sensibles.
Ne jamais les exposer dans le code frontend.
Utiliser Firebase Security Rules.

### Mobile Development ⚠️
- Toujours tester en web d'abord
- Build avant chaque test mobile
- Sync après chaque modification
- Vérifier logs Android Studio / Xcode

### Best Practices ✅
- Commiter souvent avec messages clairs
- Créer branches pour features
- Code review avant merge
- Tests avant déploiement
- Documentation à jour

---

**Version Contexte** : 1.3.1  
**Date** : 3 novembre 2025  
**Status** : ✅ Complet et à jour

**🎉 TeamSphere est prêt avec authentification professionnelle, application web moderne et mobile native !**

**Prochaine étape : Créer pages Signup et Forgot Password ! 🚀**
