// src/App.jsx
import React, { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { platform } from '@/utils/platform';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { keyboardUtils } from '@/utils/keyboard';
import { backButtonHandler } from '@/utils/backButton';
import './index.css';

export default function App() {
  useEffect(() => {
    const initMobileApp = async () => {
      if (platform.isMobile()) {
        try {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#2563eb' });
          keyboardUtils.init();
          backButtonHandler.init();
          document.body.classList.add(`platform-${platform.getPlatform()}`);
          await SplashScreen.hide();
        } catch (error) {
          console.error('❌ Error initializing mobile app:', error);
        }
      } else {
        console.log('🌐 App running in web browser');
      }
    };

    initMobileApp();

    return () => {
      if (platform.isMobile()) {
        keyboardUtils.cleanup();
        backButtonHandler.cleanup();
      }
    };
  }, []);

  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
