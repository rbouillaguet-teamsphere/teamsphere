# Contexte TeamSphere - État Actuel du Projet

## 📋 Résumé du Projet

**TeamSphere** est une application web de gestion d'équipes sportives construite avec React, Firebase et Tailwind CSS. L'application permet aux entraîneurs et gestionnaires de clubs de gérer leurs équipes, joueurs, matchs et statistiques.

**Version actuelle** : 1.2.0  
**Date de mise à jour** : 30 octobre 2025

---

## 📊 État Actuel du Projet

### ✅ Fonctionnalités Complétées

**Version 1.2.0 (Actuelle)**
- ✅ Authentification Firebase complète
- ✅ Onboarding wizard en 4 étapes
- ✅ Dashboard avec métriques en temps réel
- ✅ Gestion des joueurs (CRUD complet)
- ✅ Page Calendrier avec deux vues (semaine/liste)
- ✅ Service matchService avec 10 fonctions
- ✅ Gestion des matchs (création, affichage, scores)
- ✅ **Module Statistiques complet avec menu déroulant**
- ✅ **5 pages statistiques (Overview, Players, Events, Rankings, Charts)**
- ✅ **Composants de statistiques réutilisables**
- ✅ **Graphiques Recharts (line, bar, pie)**
- ✅ **Calculs automatiques des métriques**
- ✅ Architecture multi-tenant (clubs/équipes)
- ✅ Navigation et routing complets
- ✅ Déploiement Vercel fonctionnel

### 🚧 Fonctionnalités En Cours / À Améliorer

**Statistiques (améliorations futures)**
- [ ] Export des statistiques (PDF/Excel)
- [ ] Statistiques par compétition
- [ ] Comparaison entre saisons
- [ ] Statistiques détaillées par joueur (buts, passes, cartons)
- [ ] Graphiques avancés (heat maps, radar)
- [ ] Analyse tactique (formations, zones)

**Calendrier**
- [ ] Créer composant AddMatchModal (actuellement commenté)
- [ ] Édition de matchs existants
- [ ] Suppression de matchs
- [ ] Filtres par compétition

**Général**
- [ ] Mode sombre
- [ ] Notifications push
- [ ] Messagerie interne
- [ ] Exports de données

---

## 🏗️ Architecture Technique

### Stack Technique
```
- Frontend: React 18.3.1 + Vite 5.2.11
- Styling: Tailwind CSS 3.4.3
- Backend: Firebase (Auth + Firestore)
- Routing: React Router DOM 6.23.0
- Graphiques: Recharts 2.10.0
- Calendar: Date manipulation native
```

### Structure des Dossiers
```
src/
├── components/
│   ├── ui/              # Composants réutilisables (Button, Input, Card)
│   ├── layout/          # DashboardLayout, Sidebar
│   ├── calendar/        # Composants calendrier
│   ├── stats/           # ✅ Composants statistiques (5 nouveaux)
│   │   ├── StatsOverview.jsx
│   │   ├── PerformanceChart.jsx
│   │   ├── ComparisonStats.jsx
│   │   ├── PlayersStats.jsx
│   │   └── MatchesTable.jsx
│   └── onboarding/      # Wizard et steps
├── pages/
│   ├── DashboardPage.jsx
│   ├── PlayersPage.jsx
│   ├── CalendarPage.jsx
│   └── statistics/      # ✅ Nouveau dossier
│       ├── OverviewPage.jsx
│       ├── PlayerStatsPage.jsx
│       ├── EventStatsPage.jsx
│       ├── RankingsPage.jsx
│       └── ChartsPage.jsx
├── services/
│   └── firebase/
│       ├── auth.js
│       ├── clubs.js
│       ├── teams.js
│       ├── players.js
│       ├── matches.js
│       └── index.js
├── context/
│   └── AppContext.jsx   # Contexte global de l'app
└── router/
    └── index.jsx        # Configuration des routes (mis à jour)
```

---

## 🗄️ Structure des Données Firestore

### Collection: matches
```javascript
/clubs/{clubId}/teams/{teamId}/matches/{matchId}
{
  opponent: string,        // Nom adversaire
  date: Timestamp,         // Date du match
  isHome: boolean,         // Domicile/Extérieur
  location: string,        // Lieu
  competition: string,     // Compétition
  status: string,          // "upcoming" | "completed" | "cancelled"
  scoreTeam: number,       // Score équipe
  scoreOpponent: number,   // Score adversaire
  teamId: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: players
```javascript
/clubs/{clubId}/teams/{teamId}/players/{playerId}
{
  name: string,           // Nom complet
  position: string,       // Position (optional)
  jerseyNumber: number,   // Numéro maillot (optional)
  status: string,         // "active" | "injured" | "suspended"
  teamId: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: teams
```javascript
/clubs/{clubId}/teams/{teamId}
{
  name: string,
  category: string,       // U12, U15, Seniors, etc.
  gender: string,         // Masculin, Féminin, Mixte
  season: string,         // 2024-2025
  clubId: string,
  createdAt: Timestamp
}
```

---

## 🎨 Design System

### Composants UI Existants
```javascript
// Button - 4 variantes
<Button variant="primary|secondary|danger|ghost">

// Input avec validation
<Input label="..." error="..." hint="..." />

// Select
<Select options={[]} placeholder="..." />

// Card
<Card className="...">
```

### Couleurs Tailwind
- Primary: `blue-600`
- Success: `green-500`
- Danger: `red-500`
- Warning: `yellow-500`
- Gray scales: `gray-100` à `gray-900`

---

## 📊 Module Statistiques - Détails

### Architecture du Menu
```
📊 Statistiques (Menu déroulant)
├── 📊 Vue d'ensemble    → /statistics/overview
├── 👥 Par joueur        → /statistics/players
├── 📅 Par événement     → /statistics/events
├── 🏆 Classements       → /statistics/rankings
└── 📈 Graphiques        → /statistics/charts
```

### Composants Statistiques

#### StatsOverview.jsx
- 8 cards de métriques clés
- Icônes emoji pour identification
- Couleurs conditionnelles (vert/rouge/gris)
- Layout responsive (grid 2x4)

#### PerformanceChart.jsx
- Graphique linéaire : évolution des points
- Graphique en barres : buts marqués vs encaissés
- Recharts avec tooltips personnalisés
- Responsive et interactif

#### ComparisonStats.jsx
- Graphiques circulaires (PieChart)
- Comparaison domicile/extérieur
- Légendes et pourcentages
- Couleurs distinctives

#### PlayersStats.jsx
- Tableau interactif des joueurs
- Tri par colonne
- Recherche par nom
- Avatar + stats détaillées

#### MatchesTable.jsx
- Historique complet des matchs
- Tri par date
- Filtres par résultat
- Badges de status

### Pages Statistiques

#### OverviewPage
**Contenu** :
- 8 métriques clés en cards
- Graphique d'évolution
- Résumé de la saison

**Calculs** :
- Matchs joués, victoires, nuls, défaites
- Buts marqués/encaissés, différence
- Taux de victoire (%)
- Série actuelle (streak)

#### PlayerStatsPage
**Contenu** :
- Tableau des joueurs
- Performances individuelles
- Recherche et tri

#### EventStatsPage
**Contenu** :
- Liste chronologique des matchs
- Détails de chaque match
- Filtres par résultat

#### RankingsPage
**Contenu** :
- Comparaisons domicile/extérieur
- Graphiques circulaires
- Statistiques par lieu

#### ChartsPage
**Contenu** :
- Graphiques interactifs
- Filtres temporels (5, 10 derniers, saison)
- Visualisations multiples

---

## 🔧 Services Disponibles

### matchService
```javascript
// Récupérer tous les matchs
matchService.getAll(clubId, teamId)

// Récupérer les prochains matchs
matchService.getUpcomingMatches(clubId, teamId, limit)

// Récupérer les résultats récents
matchService.getRecentResults(clubId, teamId, limit)

// Calculer les stats de l'équipe
matchService.getTeamMatchStats(clubId, teamId)

// Écouter les changements en temps réel
matchService.listen(clubId, teamId, callback)
```

### playerService
```javascript
// Récupérer tous les joueurs
playerService.getAll(clubId, teamId)

// Écouter les changements
playerService.listen(clubId, teamId, callback)
```

---

## 📈 Statistiques Calculées

### Structure des Stats
```javascript
{
  matchesPlayed: number,      // Total matchs
  wins: number,               // Victoires
  draws: number,              // Nuls
  losses: number,             // Défaites
  winRate: string,            // Taux de victoire (%)
  goalsScored: number,        // Buts marqués
  goalsConceded: number,      // Buts encaissés
  goalDifference: number,     // Différence de buts
  homeWins: number,           // Victoires domicile
  awayWins: number,           // Victoires extérieur
  currentStreak: {
    type: 'win'|'loss'|'draw'|'none',
    count: number
  }
}
```

### Fonction calculateStreak
```javascript
const calculateStreak = (matches) => {
  // Trie les matchs par date décroissante
  // Identifie la série actuelle de résultats
  // Retourne { type, count }
};
```

---

## 🎯 Fonctionnalités du Module Statistiques

### ✅ Implémenté

**Navigation**
- ✅ Menu déroulant dans sidebar
- ✅ 5 sous-pages accessibles
- ✅ Auto-ouverture sur pages stats
- ✅ Highlighting page active
- ✅ Flèche animée (rotation)

**Visualisations**
- ✅ 8 métriques clés en cards
- ✅ Graphique linéaire (performance)
- ✅ Graphique barres (buts)
- ✅ Graphiques circulaires (comparaisons)
- ✅ Tableaux interactifs

**Calculs**
- ✅ Statistiques équipe en temps réel
- ✅ Série de victoires/défaites
- ✅ Comparaisons domicile/extérieur
- ✅ Agrégations (totaux, moyennes)

**Filtres**
- ✅ Période (5, 10 derniers, saison)
- ✅ Lieu (domicile, extérieur, tous)
- ✅ Résultat (victoire, nul, défaite)
- ✅ Recherche joueurs par nom

**UX/UI**
- ✅ Design moderne et cohérent
- ✅ Responsive (desktop, tablette, mobile)
- ✅ Empty states
- ✅ Transitions fluides
- ✅ Tooltips informatifs

### 🚧 À Améliorer

**Fonctionnalités**
- [ ] Export statistiques (PDF, Excel)
- [ ] Statistiques par compétition
- [ ] Graphiques avancés (heat maps, radar)
- [ ] Comparaisons entre saisons
- [ ] Objectifs et prédictions
- [ ] Stats détaillées joueurs (buts, passes, cartons)

**Performance**
- [ ] Cache des calculs
- [ ] Lazy loading graphiques
- [ ] Pagination historique matchs
- [ ] Service Worker offline

**UX/UI**
- [ ] Animations filtres
- [ ] Skeleton loading graphiques
- [ ] Mode sombre
- [ ] Impression rapports
- [ ] Partage statistiques

---

## 💡 Points d'Attention Techniques

### Ordre d'Exécution React
Dans les composants stats, **toujours** respecter cet ordre :
1. Hooks React (useState, useContext)
2. Filtrage des données (useMemo)
3. **Fonctions de calcul (AVANT usage)**
4. Calculs statistiques (useMemo utilisant les fonctions)
5. Rendu JSX

**Exemple correct** :
```javascript
const CompletedMatches = useMemo(/* ... */);
const calculateStreak = (matches) => { /* ... */ }; // ✅ Défini avant
const stats = useMemo(() => {
  const streak = calculateStreak(/* ... */); // ✅ Utilisé après
}, [/* ... */]);
```

### Performance Recharts
- Limiter points sur graphiques (< 100 pour fluidité)
- Utiliser `isAnimationActive={false}` si lenteur
- Wrapper dans useMemo pour éviter re-render
- Considérer throttle sur interactions

### Gestion Empty States
- **Toujours** vérifier `completedMatches.length === 0`
- Afficher message clair + appel à l'action
- Garder structure page visible
- Icônes explicatives

---

## 📚 Documentation Disponible

### Guides Projets
- `README.md` - Documentation principale
- `CHANGELOG.md` - Historique des versions
- `teamsphere-complete-context.md` - Contexte complet

### Guides Statistiques (Nouveaux)
- `README-MENU-STATISTIQUES.md` - Vue d'ensemble module
- `GUIDE-INSTALLATION-MENU.md` - Installation pas à pas
- `README-CORRECTIF.md` - Documentation bug calculateStreak

### Architecture
- Structure des dossiers documentée
- Services Firebase documentés
- Composants UI documentés

---

## 🚀 Prochaines Étapes Suggérées

### Court Terme
1. **Créer AddMatchModal** pour page Calendrier
2. **Ajouter édition/suppression matchs**
3. **Implémenter mode sombre**
4. **Ajouter exports PDF/Excel**

### Moyen Terme
1. **Module Exercices** (entraînements)
2. **Module Communication** (messagerie)
3. **Module Insights** (analyse IA)
4. **Application mobile** (React Native)

### Long Terme
1. **Multi-sports** (football, basketball, etc.)
2. **Marketplace** (plugins, intégrations)
3. **API publique** pour développeurs tiers
4. **Version white-label** pour clubs

---

## 🔗 Liens Utiles

### Documentation Externe
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Recharts](https://recharts.org/)
- [React Router](https://reactrouter.com/)

### Fichiers Clés du Projet
- `src/context/AppContext.jsx` - État global
- `src/services/firebase/matches.js` - Service matchs
- `src/components/layout/Sidebar.jsx` - Navigation
- `src/pages/statistics/*` - Pages statistiques
- `src/components/stats/*` - Composants stats

---

## ⚠️ Notes Importantes

### Dépendances Critiques
- **Recharts** : Installé pour graphiques (v2.10.0)
- **Firebase SDK** : v10.12.0
- **React Router** : v6.23.0

### Configuration Requise
- Node.js 18+
- npm ou yarn
- Compte Firebase configuré
- Variables d'environnement `.env`

### Limitations Actuelles
- Statistiques joueurs limitées (pas de buts/passes individuels dans data model)
- Pas de données historiques multi-saisons
- Calculs tous côté client (pas de cloud functions)
- Pas de cache persistant

---

## 📊 Métriques du Projet

**Code**
- ~5000 lignes de code React
- 25+ composants
- 15+ pages
- 6 services Firebase
- 100% TypeScript-ready (pas encore migré)

**Features**
- 5 modules principaux (Auth, Dashboard, Joueurs, Calendrier, Statistiques)
- 3 rôles utilisateurs (owner, admin, member)
- Multi-tenant (clubs/équipes)
- Temps réel (Firestore listeners)

**Performance**
- Build time : ~15s
- Bundle size : ~250 KB (gzippé)
- First paint : < 1s
- Time to interactive : < 2s

---

**Statut** : ✅ Production Ready (v1.2.0)  
**Dernière mise à jour** : 30 octobre 2025  
**Prochaine version prévue** : 1.3.0 (Exercices/Entraînements)
