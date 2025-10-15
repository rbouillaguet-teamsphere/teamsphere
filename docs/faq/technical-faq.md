# 🛠️ FAQ Technique - TeamSphere

## 🚀 Installation et Configuration

### Erreur "Module not found" après npm install

**Problème** : Des dépendances manquent après l'installation.

**Solution** :
```bash
# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# Réinstaller
npm install
```

### Erreur Firebase "Invalid API key"

**Problème** : Les credentials Firebase sont incorrects.

**Solution** :
1. Vérifier que le fichier `.env` existe
2. Vérifier que les variables commencent par `VITE_`
3. Redémarrer le serveur de dev (`npm run dev`)
```bash
# Vérifier les variables
cat .env

# Redémarrer
npm run dev
```

### Port 5173 déjà utilisé

**Problème** : Un autre processus utilise le port.

**Solution** :
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9

# Ou changer le port dans vite.config.js
server: { port: 3000 }
```

## 🔥 Firebase

### Permission denied lors de la lecture

**Problème** : Les Security Rules bloquent l'accès.

**Solution** :
1. Vérifier que l'utilisateur est connecté
2. Vérifier que l'utilisateur est membre du club
3. Consulter les logs Firebase Console
```javascript
// Vérifier l'auth
console.log('Current user:', auth.currentUser);

// Vérifier les memberships
const memberships = await getDocs(
  query(collection(db, 'memberships'), 
  where('userId', '==', userId))
);
```

### Quota dépassé

**Problème** : Trop de lectures/écritures Firestore.

**Solution** :
1. Activer le cache Firestore
2. Implémenter la pagination
3. Limiter les requêtes en temps réel
```javascript
// Activer le cache
import { enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db).catch((err) => {
  console.error('Persistence error:', err);
});

// Pagination
const playersQuery = query(
  collection(db, 'players'),
  limit(20)
);
```

### Indexes manquants

**Problème** : Erreur "The query requires an index".

**Solution** :
1. Cliquer sur le lien dans l'erreur
2. Créer l'index automatiquement
3. Ou ajouter dans `firestore.indexes.json`
```json
{
  "indexes": [
    {
      "collectionGroup": "players",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "clubId", "order": "ASCENDING" },
        { "fieldPath": "teamId", "order": "ASCENDING" }
      ]
    }
  ]
}
```

## ⚛️ React

### State ne se met pas à jour

**Problème** : Le state React ne se rafraîchit pas.

**Solution** :
```javascript
// ❌ Mauvais (mutation directe)
players.push(newPlayer);
setPlayers(players);

// ✅ Bon (nouveau tableau)
setPlayers([...players, newPlayer]);
```

### Infinite loop avec useEffect

**Problème** : useEffect s'exécute en boucle.

**Solution** :
```javascript
// ❌ Mauvais (dépendance manquante)
useEffect(() => {
  loadPlayers();
}, []); // loadPlayers change à chaque render

// ✅ Bon (useCallback)
const loadPlayers = useCallback(async () => {
  // ...
}, [teamId]);

useEffect(() => {
  loadPlayers();
}, [loadPlayers]);
```

### Context pas accessible

**Problème** : `useContext` retourne undefined.

**Solution** :
```javascript
// Vérifier que le composant est dans le Provider
function App() {
  return (
    <AppProvider>
      <YourComponent /> {/* ✅ À l'intérieur */}
    </AppProvider>
  );
}

// ❌ Pas ici
<YourComponent /> {/* En dehors du Provider */}
```

## 🎨 Tailwind CSS

### Classes Tailwind ne s'appliquent pas

**Problème** : Les styles ne sont pas visibles.

**Solution** :
1. Vérifier `tailwind.config.js`
2. Vérifier que les fichiers sont dans `content`
```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
```

### Classes dynamiques ne fonctionnent pas

**Problème** : `className={`text-${color}`}` ne marche pas.

**Solution** :
```javascript
// ❌ Mauvais (classe générée dynamiquement)
const color = 'red';
<div className={`text-${color}-500`} />

// ✅ Bon (classe complète)
const colorClass = color === 'red' ? 'text-red-500' : 'text-blue-500';
<div className={colorClass} />
```

## 🧪 Tests

### Tests échouent avec Firebase

**Problème** : Firebase n'est pas configuré pour les tests.

**Solution** :
```javascript
// setupTests.js
import { initializeApp } from 'firebase/app';

const testConfig = {
  apiKey: 'test-key',
  projectId: 'test-project',
  // ...
};

initializeApp(testConfig);
```

## 📦 Build et Déploiement

### Build échoue avec des erreurs TypeScript

**Problème** : Erreurs de typage lors du build.

**Solution** :
```bash
# Vérifier les types
npm run type-check

# Build avec détails
npm run build -- --debug
```

### Firebase deploy échoue

**Problème** : Erreur lors du déploiement.

**Solution** :
```bash
# Vérifier la connexion
firebase login

# Vérifier le projet
firebase use --add

# Déployer avec logs
firebase deploy --debug
```

### Variables d'environnement non définies en prod

**Problème** : Les variables `.env` ne fonctionnent pas après le build.

**Solution** :
1. Vérifier que les variables commencent par `VITE_`
2. Les définir dans Firebase Hosting ou GitHub Secrets
```bash
# GitHub Secrets
Settings > Secrets > Actions > New repository secret
```

## 🐛 Debugging

### Activer les logs Firebase
```javascript
import { setLogLevel } from 'firebase/firestore';

// En développement
if (import.meta.env.DEV) {
  setLogLevel('debug');
}
```

### React DevTools
```bash
# Installer l'extension Chrome
# React Developer Tools
```

### Console Firebase
```javascript
// Logger toutes les requêtes
const originalGetDocs = getDocs;
getDocs = async (...args) => {
  console.log('Firestore query:', args);
  return originalGetDocs(...args);
};
```

## 📊 Performance

### Optimiser les requêtes Firestore
```javascript
// ❌ Mauvais (charge tout)
const players = await getDocs(collection(db, 'players'));

// ✅ Bon (filtre côté serveur)
const players = await getDocs(
  query(
    collection(db, 'players'),
    where('teamId', '==', teamId),
    limit(20)
  )
);
```

### Lazy loading des composants
```javascript
// Code splitting
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}
```

### Memoization
```javascript
import { useMemo } from 'react';

// Éviter les recalculs coûteux
const sortedPlayers = useMemo(() => {
  return players.sort((a, b) => a.name.localeCompare(b.name));
}, [players]);
```

## 🆘 Ressources

### Documentation officielle
- [React](https://react.dev)
- [Firebase](https://firebase.google.com/docs)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)

### Communauté
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react)
- [Firebase Community](https://firebase.google.com/community)
- [GitHub Discussions](https://github.com/votre-username/teamsphere/discussions)

### Outils de debug
- React DevTools
- Firebase Emulator Suite
- Chrome DevTools