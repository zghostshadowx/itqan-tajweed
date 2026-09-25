import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GoogleUserSession {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  connectedAt: string;
  autoCloudAiEnabled: boolean;
}

const GOOGLE_USER_STORAGE_KEY = '@itqan_google_user_v1';

/**
 * Keyless Anonymous Public Cloud AI & Local Profile Session Manager.
 * Contains ZERO developer API keys, ZERO personal tokens, and ZERO developer emails.
 * Uses 100% keyless public AI inference + on-device speech & Tajweed analysis,
 * or the end-user's own personal Gemini key if they optionally add one in Settings.
 */
export class CloudPoolService {
  private static currentUser: GoogleUserSession | null = null;

  public static getBuiltInCloudCredentials(): {
    publicAiEndpoint: string;
    keylessMode: boolean;
  } {
    return {
      publicAiEndpoint: 'https://text.pollinations.ai/openai',
      keylessMode: true,
    };
  }

  public static async loadGoogleSession(): Promise<GoogleUserSession | null> {
    try {
      const raw = await AsyncStorage.getItem(GOOGLE_USER_STORAGE_KEY);
      if (raw) {
        this.currentUser = JSON.parse(raw);
        return this.currentUser;
      }
    } catch (e) {
      console.warn('Failed to load user session:', e);
    }
    return null;
  }

  public static getCurrentUser(): GoogleUserSession | null {
    return this.currentUser;
  }

  public static async signInWithGoogleQuick(
    customName?: string,
    customEmail?: string
  ): Promise<GoogleUserSession> {
    const name = (customName || '').trim() || 'طالب القرآن الكريم (ملف محلي)';
    const email = (customEmail || '').trim() || 'student@itqan.local';
    const session: GoogleUserSession = {
      id: 'local_profile_' + Date.now().toString(36),
      name,
      email,
      connectedAt: new Date().toISOString(),
      autoCloudAiEnabled: true,
    };
    this.currentUser = session;
    try {
      await AsyncStorage.setItem(GOOGLE_USER_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to persist session:', e);
    }
    return session;
  }

  public static async signOutGoogle(): Promise<void> {
    this.currentUser = null;
    try {
      await AsyncStorage.removeItem(GOOGLE_USER_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to remove session:', e);
    }
  }
}
