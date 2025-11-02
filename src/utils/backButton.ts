// src/utils/backButton.ts
import { App as CapApp } from '@capacitor/app';
import { platform } from './platform';

export const backButtonHandler = {
  init(router) {
    if (!platform.isAndroid()) return;

    // Écouter le bouton retour Android
    CapApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        // Si on ne peut pas revenir en arrière, quitter l'app
        CapApp.exitApp();
      } else {
        // Sinon, revenir en arrière dans l'historique
        window.history.back();
      }
    });
  },

  cleanup() {
    if (platform.isAndroid()) {
      CapApp.removeAllListeners();
    }
  }
};
