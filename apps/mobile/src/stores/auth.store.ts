import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { AuthUser, UserProfile, AuthSession } from '@fitpilot/shared';
import { apiClient } from '../lib/api-client';

// ─── Secure Storage Helper (Web Fallback) ─────────────────────────────────────
const ACCESS_TOKEN_KEY = 'fitpilot_access_token';
const REFRESH_TOKEN_KEY = 'fitpilot_refresh_token';
const USER_KEY = 'fitpilot_user';
const PROFILE_KEY = 'fitpilot_profile';

async function setStorageItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (err) {
    console.warn(`[SecureStore] Failed to save key "${key}":`, err);
  }
}

async function getStorageItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (err) {
    console.warn(`[SecureStore] Failed to read key "${key}":`, err);
    return null;
  }
}

async function removeStorageItem(key: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (err) {
    console.warn(`[SecureStore] Failed to remove key "${key}":`, err);
  }
}

// ─── Auth State Definition ────────────────────────────────────────────────────
export interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;

  setSession: (session: AuthSession) => Promise<void>;
  setProfile: (profile: UserProfile) => Promise<void>;
  clearSession: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,

  setSession: async (session: AuthSession) => {
    const { user, profile, tokens } = session;
    await setStorageItem(ACCESS_TOKEN_KEY, tokens.access_token);
    await setStorageItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
    await setStorageItem(USER_KEY, JSON.stringify(user));
    await setStorageItem(PROFILE_KEY, JSON.stringify(profile));

    apiClient.setAuthToken(tokens.access_token);

    set({
      user,
      profile,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      isAuthenticated: true,
    });
  },

  setProfile: async (profile: UserProfile) => {
    await setStorageItem(PROFILE_KEY, JSON.stringify(profile));
    set({ profile });
  },

  clearSession: async () => {
    await removeStorageItem(ACCESS_TOKEN_KEY);
    await removeStorageItem(REFRESH_TOKEN_KEY);
    await removeStorageItem(USER_KEY);
    await removeStorageItem(PROFILE_KEY);

    apiClient.clearAuthToken();

    set({
      user: null,
      profile: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  initialize: async () => {
    try {
      const accessToken = await getStorageItem(ACCESS_TOKEN_KEY);
      const refreshToken = await getStorageItem(REFRESH_TOKEN_KEY);
      const rawUser = await getStorageItem(USER_KEY);
      const rawProfile = await getStorageItem(PROFILE_KEY);

      if (!accessToken || !refreshToken) {
        set({ isInitialized: true, isAuthenticated: false });
        return;
      }

      apiClient.setAuthToken(accessToken);

      // Hydrate local cache first for instant UI response
      const user: AuthUser | null = rawUser ? JSON.parse(rawUser) : null;
      const profile: UserProfile | null = rawProfile ? JSON.parse(rawProfile) : null;

      set({
        user,
        profile,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      });

      // Validate with server in the background
      const res = await apiClient.get<UserProfile>('/profile');
      if (res.success) {
        await setStorageItem(PROFILE_KEY, JSON.stringify(res.data));
        set({ profile: res.data, isInitialized: true });
      } else if (res.error?.code === 'TOKEN_EXPIRED') {
        // Try to refresh
        const refreshRes = await apiClient.post<{ access_token: string; refresh_token: string }>(
          '/auth/refresh',
          { refresh_token: refreshToken },
        );

        if (refreshRes.success) {
          await setStorageItem(ACCESS_TOKEN_KEY, refreshRes.data.access_token);
          await setStorageItem(REFRESH_TOKEN_KEY, refreshRes.data.refresh_token);
          apiClient.setAuthToken(refreshRes.data.access_token);

          // Retry fetching profile
          const retryRes = await apiClient.get<UserProfile>('/profile');
          if (retryRes.success) {
            await setStorageItem(PROFILE_KEY, JSON.stringify(retryRes.data));
            set({
              profile: retryRes.data,
              accessToken: refreshRes.data.access_token,
              refreshToken: refreshRes.data.refresh_token,
              isInitialized: true,
            });
            return;
          }
        }
        await get().clearSession();
        set({ isInitialized: true });
      } else {
        set({ isInitialized: true });
      }
    } catch (err) {
      console.warn('[AuthStore] Initialization failed:', err);
      set({ isInitialized: true });
    }
  },
}));
