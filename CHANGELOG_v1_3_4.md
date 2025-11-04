# 📝 CHANGELOG - TeamSphere

## [1.3.4] - 4 novembre 2025

### ✨ Ajouté - Module Présences (Phase 2) 📊

#### Pages
- **AttendancePage.jsx**
  - Page dédiée `/attendance` pour statistiques de présence
  - Affichage composant AttendanceStats
  - Gestion états vides et chargement

#### Components Calendar
- **AttendanceStats.jsx**
  - Filtres période (saison/30j/7j) et type (tous/entraînements/matchs/réunions)
  - Statistiques globales : total, présents, absents, taux moyen
  - Classement joueurs avec médailles 🥇🥈🥉
  - Barres progression colorées (vert ≥80%, jaune 60-79%, rouge <60%)

- **AttendanceTracker.jsx**
  - Feuille de présence interactive
  - Actions rapides (tous présents/absents/réinitialiser)
  - Enregistrement en masse Firebase

- **ConvocationPanel.jsx**
  - Sélection multiple joueurs
  - Statuts convocations (accepté/refusé/peut-être)
  - Statistiques temps réel

- **EventModal.jsx**
  - Formulaire création/édition événements
  - Support matchs, entraînements, réunions

#### Router
- Route `/attendance` ajoutée avec protection

### 🔧 Modifié

**CalendarPage.jsx**
- Ajout bouton "📊 Statistiques de présence"
- Redirection vers `/attendance` via `useNavigate`
- Suppression `activeView` state et import `AttendanceStats`

---

## [1.3.3] - 3 novembre 2025
### ✨ Ajouté
- SignupPage, ForgotPasswordPage, EmailVerificationPage
- authService complet avec vérification email

---

## [1.3.2] - 3 novembre 2025
### 🐛 Corrigé
- Redirection logout

---

## [1.3.1] - 3 novembre 2025
### ✨ Ajouté
- LoginPage professionnelle
- Routes protégées

---

## [1.3.0] - 2 novembre 2025
### ✨ Ajouté
- Application mobile Capacitor

---

## [1.2.0] - 1 novembre 2025
### ✨ Ajouté
- Module Statistiques (5 pages)

---

## [1.1.0] - 31 octobre 2025
### ✨ Ajouté
- Module Calendrier

---

## [1.0.0] - 30 octobre 2025
### ✨ MVP Complet
- Gestion clubs/équipes/joueurs
- Dashboard

---

**Version** : 1.3.4  
**Date** : 4 novembre 2025
