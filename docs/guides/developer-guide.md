# 👨‍💻 Guide Développeur - TeamSphere

## Vue d'ensemble

Ce guide s'adresse aux développeurs qui souhaitent contribuer à TeamSphere ou comprendre son architecture technique.

## 🛠️ Stack Technique

### Frontend
- **React 18** : Framework UI
- **Vite** : Build tool
- **React Router** : Navigation
- **Tailwind CSS** : Styling
- **Context API** : State management

### Backend
- **Firebase** : BaaS (Backend as a Service)
  - Authentication
  - Firestore (database)
  - Hosting
  - Cloud Functions (à venir)

### Outils de développement
- **ESLint** : Linting
- **Prettier** : Code formatting
- **Vitest** : Testing
- **Git** : Version control

---

## 🚀 Configuration de l'environnement

### Prérequis
```bash
node --version  # >= 18.0.0
npm --version   # >= 9.0.0
git --version   # >= 2.30.0
```

### Installation
```bash
# Cloner le repo
git clone https://github.com/votre-username/teamsphere.git
cd teamsphere

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer Firebase (voir ci-dessous)
```

### Configuration Firebase

1. Créer un projet sur [Firebase Console](https://console.firebase.google.com)
2. Activer Authentication (Email/Password)
3. Créer une base Firestore
4. Copier les credentials dans `.env`
```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Démarrer le serveur de développement
```bash
npm run dev
# Ouvrir http://localhost:5173
```

---

## 📁 Structure du Projet
```
teamsphere/
├── .github/                 # GitHub config
│   ├── workflows/          # CI/CD
│   └── ISSUE_TEMPLATE/     # Issue templates
├── docs/                    # Documentation
├── public/                  # Assets statiques
├── src/
│   ├── components/         # Composants React
│   │   ├── common/        # Composants réutilisables
│   │   ├── layout/        # Layout (Header, Sidebar)
│   │   ├── club/          # Composants club
│   │   ├── team/          # Composants équipe
│   │   └── player/        # Composants joueur
│   ├── context/           # Context API
│   │   └── AppContext.jsx
│   ├── services/          # Services Firebase
│   │   ├── authService.js
│   │   ├── clubService.js
│   │   ├── teamService.js
│   │   └── playerService.js
│   ├── hooks/             # Custom hooks
│   │   ├── useAuth.js
│   │   └── useClub.js
│   ├── utils/             # Utilitaires
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── pages/             # Pages/Routes
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── config/            # Configuration
│   │   └── firebase.js
│   ├── App.jsx            # Composant principal
│   ├── main.jsx           # Point d'entrée
│   └── index.css          # Styles globaux
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🧩 Architecture

### Context API

**AppContext** gère le state global :
```javascript
// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentClub, setCurrentClub] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ... logique

  return (
    <AppContext.Provider value={{
      user, setUser,
      currentClub, setCurrentClub,
      currentTeam, setCurrentTeam,
      clubs, setClubs,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
```

### Services Firebase

**Pattern utilisé** : Un service par collection
```javascript
// src/services/clubService.js
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export const clubService = {
  create: async (clubData, userId) => {
    const clubRef = await addDoc(collection(db, 'clubs'), {
      ...clubData,
      createdBy: userId,
      createdAt: new Date().toISOString()
    });
    return clubRef.id;
  },

  getUserClubs: async (userId) => {
    const membershipsQuery = query(
      collection(db, 'memberships'),
      where('userId', '==', userId)
    );
    const memberships = await getDocs(membershipsQuery);
    
    // Récupérer les clubs
    const clubs = [];
    for (const doc of memberships.docs) {
      const club = await clubService.getById(doc.data().clubId);
      clubs.push(club);
    }
    return clubs;
  },

  // ... autres méthodes
};
```

### Custom Hooks
```javascript
// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useApp } from '../context/AppContext';

export const useAuth = () => {
  const { user, setUser } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    await authService.login(email, password);
  };

  const logout = async () => {
    await authService.logout();
  };

  return { user, loading, login, logout };
};
```

---

## 🎨 Conventions de Code

### Naming
```javascript
// Composants : PascalCase
const PlayerCard = () => { ... };

// Functions/variables : camelCase
const getUserClubs = () => { ... };
const playerData = { ... };

// Constants : UPPER_SNAKE_CASE
const MAX_PLAYERS = 30;
const API_ENDPOINT = '...';

// Fichiers composants : PascalCase.jsx
PlayerCard.jsx

// Fichiers services : camelCase.js
clubService.js
```

### Structure de composant
```javascript
// Imports
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Button from './common/Button';

// Composant
const PlayerCard = ({ player, onEdit, onDelete }) => {
  // Hooks
  const { currentTeam } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  // Effects
  useEffect(() => {
    // ...
  }, [player]);

  // Handlers
  const handleEdit = () => {
    setIsEditing(true);
    onEdit(player);
  };

  // Render
  return (
    <div className="card">
      {/* JSX */}
    </div>
  );
};

// PropTypes ou TypeScript
PlayerCard.propTypes = {
  player: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default PlayerCard;
```

### Commits

Format : [Conventional Commits](https://www.conventionalcommits.org/)
```bash
# Types
feat:     # Nouvelle fonctionnalité
fix:      # Correction de bug
docs:     # Documentation
style:    # Formatage (pas de changement de code)
refactor: # Refactoring
test:     # Tests
chore:    # Maintenance

# Exemples
git commit -m "feat: add player search functionality"
git commit -m "fix: resolve club switching bug"
git commit -m "docs: update API documentation"
git commit -m "refactor: simplify auth logic"
```

---

## 🧪 Tests

### Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js'
  }
});
```

### Exemple de test
```javascript
// src/components/PlayerCard.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerCard from './PlayerCard';

describe('PlayerCard', () => {
  const mockPlayer = {
    id: '1',
    firstName: 'Pierre',
    lastName: 'Martin',
    position: 'centre'
  };

  it('renders player information', () => {
    render(<PlayerCard player={mockPlayer} />);
    
    expect(screen.getByText('Pierre Martin')).toBeInTheDocument();
    expect(screen.getByText('centre')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', () => {
    const onEdit = vi.fn();
    render(<PlayerCard player={mockPlayer} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    expect(onEdit).toHaveBeenCalledWith(mockPlayer);
  });
});
```

### Lancer les tests
```bash
# Tous les tests
npm run test

# Mode watch
npm run test:watch

# Couverture
npm run test:coverage
```

---

## 🔄 Workflow Git

### Branches
```
main          # Production
develop       # Développement principal
feature/*     # Nouvelles fonctionnalités
fix/*         # Corrections de bugs
hotfix/*      # Corrections urgentes
```

### Processus de contribution
```bash
# 1. Créer une branche depuis develop
git checkout develop
git pull
git checkout -b feature/player-stats

# 2. Développer et commiter
git add .
git commit -m "feat: add player statistics display"

# 3. Pousser la branche
git push origin feature/player-stats

# 4. Créer une Pull Request sur GitHub
# 5. Code review
# 6. Merge dans develop
# 7. Release vers main
```

---

## 📦 Build et Déploiement

### Build local
```bash
# Build de production
npm run build

# Preview du build
npm run preview
```

### Déploiement Firebase
```bash
# Installation Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialisation (première fois)
firebase init

# Déployer
firebase deploy

# Déployer uniquement hosting
firebase deploy --only hosting

# Déployer uniquement les rules
firebase deploy --only firestore:rules
```

### CI/CD GitHub Actions

Le workflow `.github/workflows/deploy.yml` déploie automatiquement sur `main` :

1. Build du projet
2. Tests
3. Déploiement sur Firebase Hosting

---

## 🐛 Debugging

### React DevTools
```bash
# Chrome extension
React Developer Tools
```

### Firebase Debugging
```javascript
// Activer les logs Firestore
import { setLogLevel } from 'firebase/firestore';

if (import.meta.env.DEV) {
  setLogLevel('debug');
}
```

### Console logs structurés
```javascript
// ❌ Éviter
console.log('user', user);

// ✅ Préférer
console.log('🔵 [Auth] User loaded:', { 
  id: user.id, 
  email: user.email 
});
```

---

## 📚 Ressources

### Documentation
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Firebase](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Outils
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Firebase Emulator](https://firebase.google.com/docs/emulator-suite)
- [Postman](https://www.postman.com/) (API testing)

### Communauté
- [GitHub Discussions](https://github.com/votre-username/teamsphere/discussions)
- [Stack Overflow](https://stackoverflow.com)

---

## 🤝 Contribuer

Consultez [CONTRIBUTING.md](../../CONTRIBUTING.md) pour :
- Code of Conduct
- Comment signaler des bugs
- Comment proposer des features
- Processus de Pull Request

---

## 📞 Contact

Questions techniques ?
- 📧 Email : dev@teamsphere.app
- 💬 Discord : [TeamSphere Dev](https://discord.gg/...)
- 🐛 Issues : [GitHub Issues](https://github.com/votre-username/teamsphere/issues)