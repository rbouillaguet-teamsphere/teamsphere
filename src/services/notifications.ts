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