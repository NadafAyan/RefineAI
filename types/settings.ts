import { Timestamp } from "firebase/firestore";

export interface UserSettings {
    userId: string;
    updatedAt: Timestamp;
    defaultModel: string;
    defaultTone: number;
    theme: 'light' | 'dark' | 'system';
}

export interface SettingsHook {
    settings: UserSettings | null;
    loading: boolean;
    updateSettings: (data: Partial<Omit<UserSettings, 'userId' | 'updatedAt'>>) => Promise<void>;
    exportUserData: () => Promise<any>;
    deleteAccount: () => Promise<void>;
}
