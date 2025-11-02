// src/utils/keyboard.ts
import { Keyboard } from '@capacitor/keyboard';
import { platform } from './platform';

export const keyboardUtils = {
  // Initialiser les listeners du clavier
  init() {
    if (!platform.isMobile()) return;

    // Quand le clavier s'ouvre
    Keyboard.addListener('keyboardWillShow', (info) => {
      console.log('Keyboard showing:', info.keyboardHeight);
      // Ajuster l'UI si nécessaire
      document.body.classList.add('keyboard-open');
    });

    // Quand le clavier se ferme
    Keyboard.addListener('keyboardWillHide', () => {
      console.log('Keyboard hiding');
      document.body.classList.remove('keyboard-open');
    });
  },

  // Fermer le clavier manuellement
  hide() {
    if (platform.isMobile()) {
      Keyboard.hide();
    }
  },

  // Ouvrir le clavier
  show() {
    if (platform.isMobile()) {
      Keyboard.show();
    }
  },

  // Cleanup
  cleanup() {
    if (platform.isMobile()) {
      Keyboard.removeAllListeners();
    }
  }
};
