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
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { auth } from '../services/firebase';

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
   * Envoie automatiquement un email de vérification
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @param {string} displayName - Nom d'affichage (optionnel)
   * @returns {Promise<User>} Utilisateur Firebase
   */
  async signup(email, password, displayName = '') {
    try {
      console.log('🔷 [SIGNUP] Début inscription pour:', email);
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('✅ [SIGNUP] Compte créé avec succès:', userCredential.user.email);

      // Mettre à jour le profil si un nom est fourni
      if (displayName) {
        console.log('🔷 [SIGNUP] Mise à jour du profil avec nom:', displayName);
        await updateProfile(userCredential.user, { displayName });
        console.log('✅ [SIGNUP] Profil mis à jour');
      }

      // Envoyer l'email de vérification automatiquement
      console.log('📧 [SIGNUP] Envoi de l\'email de vérification...');
      await this.sendVerificationEmail();
      console.log('✅ [SIGNUP] Email de vérification envoyé avec succès');
      
      return userCredential.user;
    } catch (error) {
      console.error('❌ [SIGNUP] Erreur d\'inscription:', error);
      console.error('❌ [SIGNUP] Code erreur:', error.code);
      console.error('❌ [SIGNUP] Message:', error.message);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Envoyer un email de vérification
   * @returns {Promise<void>}
   */
  async sendVerificationEmail() {
    try {
      console.log('📧 [VERIFY] Récupération utilisateur actuel...');
      const user = auth.currentUser;
      
      if (!user) {
        console.error('❌ [VERIFY] Aucun utilisateur connecté');
        throw new Error('Aucun utilisateur connecté');
      }

      console.log('✅ [VERIFY] Utilisateur trouvé:', user.email);
      console.log('📧 [VERIFY] Email déjà vérifié ?', user.emailVerified);

      if (user.emailVerified) {
        console.log('✅ [VERIFY] Email déjà vérifié, pas besoin d\'envoyer');
        return;
      }

      console.log('📧 [VERIFY] Envoi de l\'email de vérification via Firebase...');
      await sendEmailVerification(user, {
        url: window.location.origin + '/login',
        handleCodeInApp: false,
      });

      console.log('✅ [VERIFY] Requête d\'envoi email réussie pour:', user.email);
      console.log('📬 [VERIFY] Vérifiez votre boîte email (et spam)');
    } catch (error) {
      console.error('❌ [VERIFY] Erreur envoi email vérification:', error);
      console.error('❌ [VERIFY] Code erreur:', error.code);
      console.error('❌ [VERIFY] Message:', error.message);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Vérifier si l'email de l'utilisateur est vérifié
   * @returns {boolean}
   */
  isEmailVerified() {
    const user = auth.currentUser;
    return user ? user.emailVerified : false;
  }

  /**
   * Recharger les données de l'utilisateur depuis Firebase
   * Utile pour vérifier si l'email a été vérifié
   * @returns {Promise<void>}
   */
  async reloadUser() {
    try {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        console.log('✅ Données utilisateur rechargées');
      }
    } catch (error) {
      console.error('❌ Erreur rechargement utilisateur:', error);
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
      throw new Error('Erreur lors de la déconnexion');
    }
  }

  /**
   * Réinitialiser le mot de passe
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<void>}
   */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin + '/login',
        handleCodeInApp: false,
      });
      console.log('✅ Email de réinitialisation envoyé à:', email);
    } catch (error) {
      console.error('❌ Erreur reset password:', error.code);
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
   * @param {Function} callback - Fonction appelée à chaque changement
   * @returns {Function} Fonction de désabonnement
   */
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Vérifier si un utilisateur est connecté
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!auth.currentUser;
  }

  /**
   * Vérifier si l'utilisateur n'est PAS connecté
   * @returns {boolean}
   */
  isGuest() {
    return !auth.currentUser;
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
      
      // Erreurs de vérification email
      'auth/too-many-requests': 'Trop de tentatives. Veuillez réessayer plus tard',
      'auth/invalid-action-code': 'Le lien de vérification est invalide ou a expiré',
      'auth/expired-action-code': 'Le lien de vérification a expiré',
      
      // Erreurs générales
      'auth/network-request-failed': 'Erreur de connexion. Vérifiez votre réseau',
      'auth/operation-not-allowed': 'Cette opération n\'est pas autorisée',
      
      // Erreurs popup
      'auth/popup-blocked': 'La popup a été bloquée par le navigateur',
      'auth/popup-closed-by-user': 'La connexion a été annulée',
      'auth/cancelled-popup-request': 'Une autre popup est déjà ouverte',
    };

    return errorMessages[errorCode] || 'Une erreur est survenue. Veuillez réessayer';
  }
}

// Export d'une instance unique (singleton)
export const authService = new AuthService();

// Export également la classe pour les tests
export default authService;
