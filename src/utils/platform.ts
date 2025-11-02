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