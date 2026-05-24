import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { profileApi } from '@/shared/api/profileApi';

interface Settings {
  background: {
    image: string | null;
    size: 'cover' | 'contain' | 'auto';
    position: string;
    attachment: 'fixed' | 'scroll';
  };
  // theme: 'light' | 'dark' | 'system';
  // notifications: { email: boolean; push: boolean; };
  // language: string;
}

interface SettingsStore {
  settings: Settings;
  isLoading: boolean;

  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  updateSection: <K extends keyof Settings>(
    section: K, 
    data: Partial<Settings[K]>
  ) => Promise<void>;
  loadSettings: () => Promise<void>;
  resetSection: (section: keyof Settings) => Promise<void>;
}

const defaultSettings: Settings = {
  background: {
    image: null,
    size: 'cover',
    position: 'center',
    attachment: 'fixed'
  }
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      isLoading: false,
      loadSettings: async () => {
        set({ isLoading: true });
        try {
          const response = await profileApi.getSettings();
          set({ settings: response.settings });
        } catch (error) {
          console.error('Failed to load settings:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateSettings: async (newSettings) => {
        set({ isLoading: true });
        try {
          const updatedSettings = { ...get().settings, ...newSettings };
          set({ settings: updatedSettings });
          await profileApi.updateSettings(updatedSettings);
        } catch (error) {
          console.error('Failed to update settings:', error);
          await get().loadSettings();
        } finally {
          set({ isLoading: false });
        }
      },

      updateSection: async (section, data) => {
        set({ isLoading: true });
        try {
          const currentSettings = get().settings;
          const updatedSection = { ...currentSettings[section], ...data };
          const updatedSettings = { ...currentSettings, [section]: updatedSection };
          
          set({ settings: updatedSettings });
          await profileApi.updateSettingsSection(section, updatedSection);
        } catch (error) {
          console.error(`Failed to update ${section}:`, error);
          await get().loadSettings();
        } finally {
          set({ isLoading: false });
        }
      },
      resetSection: async (section) => {
        await get().updateSection(section, defaultSettings[section]);
      }
    }),
    {
      name: 'user-settings', 
    }
  )
);