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