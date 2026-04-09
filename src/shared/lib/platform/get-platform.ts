import { isMaxEnvironment, type MaxWebApp } from '@/shared/lib/max/max.sdk';
import { retrieveLaunchParams } from '@tma.js/sdk';

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

export const isTmaMiniApp = (): boolean => {
	try {
		const params = retrieveLaunchParams();
		return params?.tgWebAppPlatform !== null;
	} catch {
		return false;
	}
};

export const detectPlatform = (): AppPlatform => {
	// React Native detection
	try {
		const RNPlatform = require('react-native').Platform;
		if (RNPlatform.OS === 'ios') return 'ios';
		if (RNPlatform.OS === 'android') return 'android';
	} catch {
		// Not in React Native
	}

	if (typeof window !== 'undefined') {
		if (isMaxEnvironment()) return 'max';

		if (window?.Telegram?.WebApp) return 'tg';

		if (isTmaMiniApp()) return 'tg';

		return 'web';
	}

	return 'unknown';
};

export const isTgPlatform = (platform: AppPlatform): boolean =>
	platform === 'tg';
export const isMaxPlatform = (platform: AppPlatform): boolean =>
	platform === 'max';
export const isMobilePlatform = (platform: AppPlatform): boolean =>
	platform === 'ios' || platform === 'android';
