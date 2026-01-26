import { parseGroups } from '@/entities/user/lib/parse-groups';
import { User } from '@/entities/user/model/user.model';
import { http } from '@/shared/api/http/http';
import { BASE_URL } from '@/shared/constants/base';
import { secureStorage } from '@/shared/lib';
import { detectPlatform } from '@/shared/lib/platform/get-platform';
import { create } from 'zustand';

const getCookieManager = async () => {
	const platform = detectPlatform();
	if (platform === 'android' || platform === 'ios') {
		return (await import('@react-native-cookies/cookies')).default;
	}
	return null;
};

type AuthState = {
	user: User | null;
	groups: string[];
	isAuth: boolean;
	loading: boolean;
	error?: string;

	checkAuth: () => Promise<void>;
	validateAuth: () => Promise<any>;
};

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	groups: [],
	isAuth: false,
	loading: true,
	error: undefined,

	checkAuth: async () => {
		set({ loading: true, error: undefined });
		try {
			const PLATFORM = detectPlatform();
			if (PLATFORM === 'web') {
				const user = await http.get<User>('/userinfo');
				set({
					user,
					groups: parseGroups(user.groups),
					isAuth: true,
					loading: false,
				});

				return;
			}

			throw new Error('Unknown platform');
		} catch (err: any) {
			console.log('[Auth] error:', err.message);
			set({ isAuth: false, loading: false });
			secureStorage.clearAll();
		}
	},

	validateAuth: async () => {
		try {
			const platform = detectPlatform();
			if (platform === 'web') {
				return;
			} else if (platform === 'android' || platform === 'ios') {
				const CookieManager = await getCookieManager();
				if (!CookieManager) return;
				const cookies = await CookieManager.get(BASE_URL, true);
				const user = await http.get<User>('/userinfo');
				if (cookies.access_token) {
					secureStorage.setItem('access_token', cookies.access_token.value);
				}
				return { ...user, cookies };
			}
		} catch (error: any) {
			console.error('[Auth validation]', error.message);
			set({ isAuth: false, loading: false });
			secureStorage.clearAll();
		}
	},
}));
