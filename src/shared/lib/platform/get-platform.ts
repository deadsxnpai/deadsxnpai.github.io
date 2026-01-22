// lib/platform/detect.ts
import { Platform as RNPlatform } from 'react-native';

export type AppPlatform =
	| 'ios'
	| 'android'
	| 'web'
	| 'tgWeb'
	| 'tgMobile'
	| 'unknown';

/**
 * Detects the platform/environment the app is running in.
 */
export const detectPlatform = (): AppPlatform => {
	// Mobile native platforms
	if (RNPlatform.OS === 'ios') return 'ios';
	if (RNPlatform.OS === 'android') return 'android';

	// Web platform
	if (RNPlatform.OS === 'web') {
		if (typeof window !== 'undefined') {
			// Telegram WebApp detection
			const tg = (window as any).Telegram?.WebApp;
			if (tg) return 'tgWeb';

			// Optional: detect if in Telegram mobile browser (not WebApp)
			const userAgent = window.navigator.userAgent.toLowerCase();
			if (userAgent.includes('telegram')) return 'tgMobile';
		}
		return 'web';
	}

	return 'unknown';
};
