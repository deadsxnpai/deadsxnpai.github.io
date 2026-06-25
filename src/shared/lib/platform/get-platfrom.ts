import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

declare global {
    interface Window {
        Telegram?: {
            WebApp?: any;
        };
        WebApp: any;
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



export const usePlatform = (): AppPlatform => {
    const [platform, setPlatform] = useState<AppPlatform>(() => {
        if (Platform.OS === 'ios') return 'ios';
        if (Platform.OS === 'android') return 'android';
        return 'web';
    });

    useEffect(() => {
        if (platform === 'ios' || platform === 'android') return;

        const checkMax = setInterval(() => {
            if (window?.WebApp?.initData) {
                setPlatform('max');
                clearInterval(checkMax);
                clearInterval(checkTg);
            }
        }, 100);

        // Check for Telegram platform (uses window.Telegram.WebApp)
        const checkTg = setInterval(() => {
            if (window?.Telegram?.WebApp?.initData) {
                setPlatform('tg');
                clearInterval(checkTg);
                clearInterval(checkMax);
            }
        }, 100);


        const timeout = setTimeout(() => {
            clearInterval(checkMax);
            clearInterval(checkTg);
        }, 2000);

        return () => {
            clearInterval(checkMax);
            clearInterval(checkTg);
            clearTimeout(timeout);
        };
    }, []);

    return platform;
};