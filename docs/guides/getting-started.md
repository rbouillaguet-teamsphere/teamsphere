# 🚀 Guide de démarrage rapide

## Prérequis

- Node.js >= 18.0.0
- npm >= 9.0.0
- Compte Firebase

## Installation

### 1. Cloner le repository
```bash
git clone https://github.com/votre-username/teamsphere.git
cd teamsphere
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer Firebase

1. Créer un projet sur https://console.firebase.google.com
2. Activer Authentication (Email/Password)
3. Activer Firestore Database
4. Copier les credentials

### 4. Configuration locale
```bash
cp .env.example .env
```

Éditez `.env` avec vos credentials Firebase :
```
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_auth_domain
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
```

### 5. Déployer les Security Rules
```bash
firebase login
firebase init
npm run firebase:deploy:rules
```

### 6. Lancer l'application
```bash
npm run dev
```

Ouvrir http://localhost:5173

## Premiers pas

### Créer un compte

1. Cliquer sur "S'inscrire"
2. Remplir le formulaire
3. Valider

### Créer votre premier club

1. Cliquer sur "Créer un club"
2. Remplir les informations
3. Vous êtes automatiquement Admin

### Créer une équipe

1. Dans le dashboard
2. Section "Équipes" > "Nouvelle équipe"
3. Remplir le formulaire

### Ajouter des joueurs

1. Sélectionner l'équipe
2. "Ajouter un joueur"
3. Remplir les informations

## Scripts disponibles
```bash
# Développement
npm run dev

# Build production
npm run build

# Preview du build
npm run preview

# Linter
npm run lint

# Tests
npm run test

# Déployer Firebase
npm run deploy
```

## Besoin d'aide ?

Consultez la [FAQ](../faq/client-faq.md) ou [ouvrez une issue](https://github.com/votre-username/teamsphere/issues/new/choose).