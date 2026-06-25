import { MaxWebApp } from '../sdk/web-apps.sdk';

declare global {
    interface Window {
        Telegram?: {
            WebApp?: any;
        };
        TmaWebApp?: any;
        MaxWebApp?: MaxWebApp;
    }
}

export type AppPlatform = 'ios' | 'android' | 'web' | 'tg' | 'max' | 'unknown';


export const detectPlatform = (): AppPlatform => {
    try {
        const RNPlatform = require('react-native').Platform;
        if (RNPlatform.OS === 'ios') return 'ios';
        if (RNPlatform.OS === 'android') return 'android';
    } catch {
    }
    if (typeof window !== 'undefined') {
        if (window?.Telegram?.WebApp) return 'tg';
        return 'web';
    }
    return 'unknown';
};

export const isTgPlatform = (platform: AppPlatform): boolean =>
    platform === 'tg';

