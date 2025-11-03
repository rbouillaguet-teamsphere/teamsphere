// src/services/authService.js
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/config/firebase';

/**
 * Service d'authentification Firebase
 * Gère toutes les opérations d'authentification de l'application
 */
class AuthService {
  
  /**
   * Connexion avec email et mot de passe
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<User>} Utilisateur Firebase
   */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        email, 
        password
      );
      console.log('✅ Connexion réussie:', userCredential.user.email);
      return userCredential.user;
    } catch (error) {
      console.error('❌ Erreur de connexion:', error.code);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Inscription avec email et mot de passe
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @param {string} displayName - Nom d'affichage (optionnel)
   * @returns {Promise<User>} Utilisateur Firebase
   */
  async signup(email, password, displayName = '') {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Mettre à jour le profil si un nom est fourni
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      console.log('✅ Inscription réussie:', userCredential.user.email);
      return userCredential.user;
    } catch (error) {
      console.error('❌ Erreur d\'inscription:', error.code);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Connexion avec Google
   * @returns {Promise<User>} Utilisateur Firebase
   */
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');

      const result = await signInWithPopup(auth, provider);
      
      // Récupérer les infos supplémentaires si nécessaire
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      console.log('✅ Connexion Google réussie:', result.user.email);
      return result.user;
    } catch (error) {
      console.error('❌ Erreur Google Auth:', error);
      
      // Gestion des erreurs spécifiques à la popup
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Connexion annulée');
      }
      
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Connexion avec Apple
   * @returns {Promise<User>} Utilisateur Firebase
   */
  async loginWithApple() {
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');

      const result = await signInWithPopup(auth, provider);
      
      console.log('✅ Connexion Apple réussie:', result.user.email);
      return result.user;
    } catch (error) {
      console.error('❌ Erreur Apple Auth:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Connexion annulée');
      }
      
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Déconnexion
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await signOut(auth);
      console.log('✅ Déconnexion réussie');
    } catch (error) {
      console.error('❌ Erreur de déconnexion:', error);
      throw new Error('Impossible de se déconnecter');
    }
  }

  /**
   * Réinitialisation du mot de passe
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<void>}
   */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Email de réinitialisation envoyé à:', email);
    } catch (error) {
      console.error('❌ Erreur reset password:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Obtenir l'utilisateur actuellement connecté
   * @returns {User|null} Utilisateur Firebase ou null
   */
  getCurrentUser() {
    return auth.currentUser;
  }

  /**
   * Observer les changements d'état d'authentification
   * @param {Function} callback - Fonction appelée lors du changement d'état
   * @returns {Function} Fonction de désinscription
   */
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Vérifier si un utilisateur est connecté
   * @returns {boolean} True si connecté
   */
  isAuthenticated() {
    return !!auth.currentUser;
  }

  /**
   * Obtenir le token d'authentification
   * @returns {Promise<string|null>} Token JWT ou null
   */
  async getIdToken() {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      return await user.getIdToken();
    } catch (error) {
      console.error('❌ Erreur récupération token:', error);
      return null;
    }
  }

  /**
   * Rafraîchir le token
   * @returns {Promise<string|null>} Nouveau token ou null
   */
  async refreshToken() {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      return await user.getIdToken(true); // Force refresh
    } catch (error) {
      console.error('❌ Erreur refresh token:', error);
      return null;
    }
  }

  /**
   * Obtenir un message d'erreur convivial
   * @param {string} errorCode - Code d'erreur Firebase
   * @returns {string} Message d'erreur traduit
   */
  getErrorMessage(errorCode) {
    const errorMessages = {
      // Erreurs de connexion
      'auth/invalid-email': 'L\'adresse email est invalide',
      'auth/user-disabled': 'Ce compte a été désactivé',
      'auth/user-not-found': 'Aucun compte ne correspond à cet email',
      'auth/wrong-password': 'Mot de passe incorrect',
      'auth/invalid-credential': 'Email ou mot de passe incorrect',
      
      // Erreurs d'inscription
      'auth/email-already-in-use': 'Cet email est déjà utilisé',
      'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
      
      // Erreurs générales
      'auth/too-many-requests': 'Trop de tentatives. Veuillez réessayer plus tard',
      'auth/network-request-failed': 'Erreur de connexion. Vérifiez votre réseau',
      'auth/operation-not-allowed': 'Cette opération n\'est pas autorisée',
      
      // Erreurs popup
      'auth/popup-blocked': 'La popup a été bloquée par le navigateur',
      'auth/popup-closed-by-user': 'La connexion a été annulée',
      'auth/cancelled-popup-request': 'Une autre popup est déjà ouverte',
      
      // Erreurs de token
      'auth/invalid-action-code': 'Le lien est invalide ou a expiré',
      'auth/expired-action-code': 'Le lien a expiré'
    };

    return errorMessages[errorCode] || 'Une erreur est survenue. Veuillez réessayer';
  }
}

// Export d'une instance unique (singleton)
export const authService = new AuthService();

// Export également la classe pour les tests
export default AuthService;
