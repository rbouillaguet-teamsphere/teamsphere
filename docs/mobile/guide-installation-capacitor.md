# 🚀 Guide d'Installation Capacitor pour TeamSphere

## 📋 Ce que vous allez obtenir

À la fin de ce guide, vous aurez :
- ✅ Votre app React actuelle transformée en app mobile native
- ✅ App Android fonctionnelle
- ✅ App iOS fonctionnelle (si vous avez un Mac)
- ✅ Accès aux fonctionnalités natives (caméra, notifications, etc.)
- ✅ Prêt pour publication sur les stores

**Temps estimé** : 2-4 heures pour la config initiale

---

## 🛠️ Prérequis

### Logiciels nécessaires

#### Pour Android
- ✅ Node.js 18+ (vous l'avez déjà)
- ✅ VS Code (vous l'avez déjà)
- ⚠️ **Android Studio** (à installer)
- ⚠️ **JDK 17** (Java Development Kit)

#### Pour iOS (optionnel, nécessite un Mac)
- ⚠️ Mac avec macOS 12+
- ⚠️ Xcode 14+
- ⚠️ Command Line Tools

### Vérifier Node.js
```bash
node --version  # Doit être >= 18.0.0
npm --version   # Doit être >= 9.0.0
```

---

## 📦 Étape 1 : Installation de Capacitor

### 1.1 Installer les packages Capacitor

Ouvrez un terminal dans votre projet TeamSphere et exécutez :

```bash
# Dans le dossier teamsphere/
cd teamsphere

# Installer Capacitor
npm install @capacitor/core @capacitor/cli

# Installer les plugins essentiels
npm install @capacitor/app @capacitor/splash-screen @capacitor/status-bar
```

### 1.2 Initialiser Capacitor

```bash
npx cap init
```

**Répondez aux questions suivantes :**

```
? App name: TeamSphere
? App package ID: com.teamsphere.app
? Web asset directory: dist
```

**Explications :**
- **App name** : Le nom affiché sur l'écran d'accueil
- **Package ID** : Identifiant unique (format reverse domain)
- **Web asset directory** : `dist` (le dossier de build de Vite)

### 1.3 Vérifier la configuration

Capacitor a créé un fichier `capacitor.config.ts` :

```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.teamsphere.app',
  appName: 'TeamSphere',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

---

## 📱 Étape 2 : Ajouter les Plateformes

### 2.1 Ajouter Android

```bash
# Installer le package Android
npm install @capacitor/android

# Créer le projet Android
npx cap add android
```

✅ Cela crée un dossier `android/` avec un projet Android Studio complet.

### 2.2 Ajouter iOS (optionnel, Mac uniquement)

```bash
# Installer le package iOS
npm install @capacitor/ios

# Créer le projet iOS
npx cap add ios
```

✅ Cela crée un dossier `ios/` avec un projet Xcode complet.

---

## 🔧 Étape 3 : Adapter votre Code React

### 3.1 Mettre à jour package.json

Ajoutez ces scripts pour faciliter le développement :

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    
    "cap:sync": "cap sync",
    "cap:android": "cap open android",
    "cap:ios": "cap open ios",
    
    "mobile:build": "npm run build && cap sync",
    "mobile:android": "npm run build && cap sync && cap open android",
    "mobile:ios": "npm run build && cap sync && cap open ios"
  }
}
```

### 3.2 Optimiser vite.config.js pour mobile

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Optimisations pour mobile
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        }
      }
    }
  }
});
```

### 3.3 Ajouter la détection de plateforme

Créez un fichier pour détecter si l'app tourne en mode mobile :

```typescript
// src/utils/platform.ts
import { Capacitor } from '@capacitor/core';

export const platform = {
  // Est-ce qu'on est dans l'app mobile ?
  isMobile: () => Capacitor.isNativePlatform(),
  
  // Est-ce qu'on est sur le web ?
  isWeb: () => !Capacitor.isNativePlatform(),
  
  // Quelle plateforme ?
  getPlatform: () => Capacitor.getPlatform(), // 'ios', 'android', ou 'web'
  
  // Est iOS ?
  isIOS: () => Capacitor.getPlatform() === 'ios',
  
  // Est Android ?
  isAndroid: () => Capacitor.getPlatform() === 'android'
};
```

**Utilisation :**

```javascript
import { platform } from '@/utils/platform';

// Adapter le comportement selon la plateforme
if (platform.isMobile()) {
  // Code spécifique mobile
  console.log('Running as native app');
} else {
  // Code spécifique web
  console.log('Running in browser');
}
```

---

## 📸 Étape 4 : Ajouter des Fonctionnalités Natives

### 4.1 Plugin Caméra

```bash
npm install @capacitor/camera
```

**Utilisation dans votre code :**

```javascript
// src/components/TakePhoto.jsx
import { Camera, CameraResultType } from '@capacitor/camera';

async function takePicture() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    
    // image.webPath contient l'URL de la photo
    return image.webPath;
  } catch (error) {
    console.error('Error taking picture:', error);
  }
}

export function PhotoButton() {
  const handleTakePhoto = async () => {
    const photoUrl = await takePicture();
    console.log('Photo URL:', photoUrl);
    // Uploader vers Firebase Storage...
  };
  
  return (
    <button onClick={handleTakePhoto}>
      📸 Prendre une photo
    </button>
  );
}
```

### 4.2 Notifications Push

```bash
npm install @capacitor/push-notifications
```

**Configuration basique :**

```javascript
// src/services/notifications.ts
import { PushNotifications } from '@capacitor/push-notifications';

export const initPushNotifications = async () => {
  // Demander permission
  let permStatus = await PushNotifications.checkPermissions();
  
  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }
  
  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions!');
  }
  
  // Enregistrer l'app
  await PushNotifications.register();
  
  // Écouter les événements
  PushNotifications.addListener('registration', (token) => {
    console.log('Push token:', token.value);
    // Sauvegarder le token dans Firestore
  });
  
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push received:', notification);
  });
};
```

### 4.3 Stockage Local Persistant

```bash
npm install @capacitor/preferences
```

**Utilisation :**

```javascript
// src/services/storage.ts
import { Preferences } from '@capacitor/preferences';

export const storage = {
  async set(key: string, value: any) {
    await Preferences.set({
      key: key,
      value: JSON.stringify(value)
    });
  },
  
  async get(key: string) {
    const { value } = await Preferences.get({ key: key });
    return value ? JSON.parse(value) : null;
  },
  
  async remove(key: string) {
    await Preferences.remove({ key: key });
  }
};

// Utilisation
await storage.set('lastSelectedTeam', { id: '123', name: 'Seniors' });
const team = await storage.get('lastSelectedTeam');
```

### 4.4 Géolocalisation

```bash
npm install @capacitor/geolocation
```

**Utilisation :**

```javascript
import { Geolocation } from '@capacitor/geolocation';

async function getCurrentPosition() {
  const coordinates = await Geolocation.getCurrentPosition();
  return {
    lat: coordinates.coords.latitude,
    lng: coordinates.coords.longitude
  };
}
```

### 4.5 Partage

```bash
npm install @capacitor/share
```

**Utilisation :**

```javascript
import { Share } from '@capacitor/share';

async function shareMatch(match) {
  await Share.share({
    title: `Match ${match.opponent}`,
    text: `Match contre ${match.opponent} le ${match.date}`,
    url: `https://teamsphere.app/matches/${match.id}`,
    dialogTitle: 'Partager le match'
  });
}
```

---

## 🏗️ Étape 5 : Build et Test

### 5.1 Build votre application React

```bash
npm run build
```

✅ Cela génère le dossier `dist/` avec votre app optimisée.

### 5.2 Synchroniser avec les projets natifs

```bash
npx cap sync
```

Cette commande :
- Copie les fichiers de `dist/` vers les projets natifs
- Installe les plugins natifs
- Met à jour les configurations

### 5.3 Tester sur Android

#### Installer Android Studio

1. Télécharger : https://developer.android.com/studio
2. Installer avec les paramètres par défaut
3. Ouvrir Android Studio
4. Tools > SDK Manager > Installer Android 13 (API 33)

#### Ouvrir le projet Android

```bash
npx cap open android
```

✅ Android Studio s'ouvre avec votre projet.

#### Créer un émulateur

1. Tools > Device Manager
2. Create Device
3. Choisir "Pixel 5"
4. Choisir "Tiramisu" (API 33)
5. Finish

#### Lancer l'app

1. Cliquer sur le bouton ▶️ (Run)
2. Sélectionner l'émulateur
3. Attendre le lancement (2-3 minutes la première fois)

✅ Votre app TeamSphere s'ouvre dans l'émulateur !

### 5.4 Tester sur iOS (Mac uniquement)

#### Installer Xcode

1. App Store > Rechercher "Xcode"
2. Installer (c'est gratuit mais ~15 GB)
3. Ouvrir Xcode une fois installé

#### Ouvrir le projet iOS

```bash
npx cap open ios
```

✅ Xcode s'ouvre avec votre projet.

#### Lancer l'app

1. Sélectionner un simulateur (iPhone 14 Pro)
2. Cliquer sur ▶️ (Run)
3. Attendre le lancement

✅ Votre app s'ouvre dans le simulateur !

---

## 🎨 Étape 6 : Optimisations Mobile

### 6.1 Splash Screen

Créez des images pour l'écran de démarrage :

```bash
npm install @capacitor/assets --save-dev
```

Créez un dossier `resources/` avec :
- `icon.png` (1024x1024)
- `splash.png` (2732x2732)

Générer les assets :

```bash
npx capacitor-assets generate --iconBackgroundColor "#2563eb" --iconBackgroundColorDark "#1e40af" --splashBackgroundColor "#ffffff" --splashBackgroundColorDark "#000000"
```

### 6.2 Status Bar (barre de statut)

```typescript
// src/App.jsx
import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Configurer la status bar au démarrage
    if (platform.isMobile()) {
      StatusBar.setStyle({ style: Style.Light });
      StatusBar.setBackgroundColor({ color: '#2563eb' });
    }
  }, []);
  
  return (
    // Votre app...
  );
}
```

### 6.3 Navigation native (Back button Android)

```typescript
// src/App.jsx
import { App as CapApp } from '@capacitor/app';

useEffect(() => {
  const backButtonListener = CapApp.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      CapApp.exitApp();
    } else {
      window.history.back();
    }
  });
  
  return () => backButtonListener.remove();
}, []);
```

### 6.4 Keyboard (clavier)

```bash
npm install @capacitor/keyboard
```

```typescript
import { Keyboard } from '@capacitor/keyboard';

// Fermer le clavier automatiquement
Keyboard.addListener('keyboardWillShow', () => {
  // Ajuster l'UI si nécessaire
});

Keyboard.addListener('keyboardWillHide', () => {
  // Restaurer l'UI
});
```

---

## 📱 Étape 7 : Icônes et Branding

### 7.1 Créer les icônes

Vous avez besoin d'une icône 1024x1024 au format PNG.

**Structure requise :**
```
resources/
├── icon.png          # 1024x1024 - Icône principale
├── splash.png        # 2732x2732 - Splash screen
└── android/
    └── icon-foreground.png  # Optionnel pour adaptive icon
```

### 7.2 Générer toutes les tailles

```bash
npx capacitor-assets generate
```

Cela génère automatiquement :
- Android : mipmap-mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi
- iOS : AppIcon.appiconset avec toutes les tailles

### 7.3 Personnaliser les couleurs

```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.teamsphere.app',
  appName: 'TeamSphere',
  webDir: 'dist',
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2563eb",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#ffffff"
    }
  }
};
```

---

## 🔒 Étape 8 : Permissions et Sécurité

### 8.1 Configurer les permissions Android

Éditez `android/app/src/main/AndroidManifest.xml` :

```xml
<manifest>
    <!-- Permissions nécessaires -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    
    <application>
        <!-- ... -->
    </application>
</manifest>
```

### 8.2 Configurer les permissions iOS

Éditez `ios/App/App/Info.plist` :

```xml
<dict>
    <key>NSCameraUsageDescription</key>
    <string>TeamSphere a besoin d'accès à votre caméra pour prendre des photos de joueurs.</string>
    
    <key>NSPhotoLibraryUsageDescription</key>
    <string>TeamSphere a besoin d'accès à vos photos.</string>
    
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>TeamSphere utilise votre position pour trouver les terrains à proximité.</string>
</dict>
```

---

## 🚀 Étape 9 : Workflow de Développement

### 9.1 Développement quotidien

```bash
# 1. Développer dans le navigateur (plus rapide)
npm run dev

# 2. Tester une fonctionnalité native
npm run build
npx cap sync
npx cap open android  # ou ios
```

### 9.2 Live Reload sur device

Pour développer plus rapidement sur un vrai téléphone :

```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.teamsphere.app',
  appName: 'TeamSphere',
  webDir: 'dist',
  
  server: {
    // Remplacer par votre IP locale
    url: 'http://192.168.1.100:5173',
    cleartext: true
  }
};
```

```bash
# Terminal 1
npm run dev

# Terminal 2
npx cap sync
npx cap run android  # ou ios
```

✅ Maintenant les changements sont visibles en temps réel sur l'app !

### 9.3 Debugging

#### Web
```bash
npm run dev
# Ouvrir Chrome DevTools
```

#### Android
```bash
# Ouvrir chrome://inspect dans Chrome
# Sélectionner votre app
# Vous avez accès à la console !
```

#### iOS
```bash
# Safari > Develop > Simulator > localhost
```

---

## 📦 Étape 10 : Build pour Production

### 10.1 Android (APK/AAB)

#### Générer une clé de signature

```bash
cd android
keytool -genkey -v -keystore teamsphere.keystore -alias teamsphere -keyalg RSA -keysize 2048 -validity 10000
```

Répondez aux questions et **sauvegardez le mot de passe** !

#### Configurer Gradle

Créez `android/key.properties` :

```properties
storePassword=VOTRE_MOT_DE_PASSE
keyPassword=VOTRE_MOT_DE_PASSE
keyAlias=teamsphere
storeFile=../teamsphere.keystore
```

⚠️ **Ajoutez `key.properties` au .gitignore !**

#### Build de production

```bash
cd android
./gradlew assembleRelease
```

✅ L'APK se trouve dans `android/app/build/outputs/apk/release/`

#### Build AAB (pour Play Store)

```bash
cd android
./gradlew bundleRelease
```

✅ L'AAB se trouve dans `android/app/build/outputs/bundle/release/`

### 10.2 iOS (IPA)

#### Configuration Xcode

1. Ouvrir `npx cap open ios`
2. Sélectionner le projet TeamSphere
3. Signing & Capabilities
4. Cocher "Automatically manage signing"
5. Sélectionner votre équipe Apple Developer

#### Build

1. Product > Archive
2. Distribute App
3. App Store Connect
4. Upload

---

## 🎯 Checklist Finale

### Avant de publier

- [ ] Tester sur plusieurs devices (Android + iOS)
- [ ] Vérifier les permissions
- [ ] Tester en mode offline
- [ ] Vérifier le splash screen
- [ ] Tester les deep links
- [ ] Optimiser les images
- [ ] Vérifier la taille de l'app (< 50 MB idéal)
- [ ] Préparer les screenshots pour les stores
- [ ] Rédiger la description
- [ ] Définir les mots-clés (ASO)
- [ ] Préparer l'icône 1024x1024
- [ ] Créer une privacy policy
- [ ] Créer les termes et conditions

---

## 🐛 Troubleshooting

### Erreur : "Unable to load web assets"

```bash
# Rebuild et sync
npm run build
npx cap sync
```

### Erreur : Gradle build failed

```bash
# Dans Android Studio
File > Invalidate Caches / Restart
```

### Les changements ne s'affichent pas

```bash
# Clear tout et rebuild
npx cap copy
npx cap sync --force
```

### Firebase ne fonctionne pas sur mobile

Vérifiez que vous avez ajouté les fichiers de config :
- Android : `android/app/google-services.json`
- iOS : `ios/App/GoogleService-Info.plist`

---

## 🎓 Ressources Utiles

### Documentation
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Plugin API Reference](https://capacitorjs.com/docs/apis)
- [Android Studio Guide](https://developer.android.com/studio/intro)
- [Xcode Guide](https://developer.apple.com/xcode/)

### Communauté
- [Capacitor Discord](https://discord.com/invite/UPYYRhtyzp)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/capacitor)
- [GitHub Discussions](https://github.com/ionic-team/capacitor/discussions)

---

## ✅ Prochaines Étapes

Une fois Capacitor installé et testé :

1. **Optimiser pour mobile** : Améliorer l'UI/UX mobile
2. **Ajouter des features natives** : Caméra, notifications...
3. **Préparer la publication** : Screenshots, description...
4. **Publier sur Play Store** : Créer compte développeur ($25)
5. **Publier sur App Store** : Créer compte développeur ($99/an)

Besoin d'aide sur une étape spécifique ? Dites-moi ! 🚀
