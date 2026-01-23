import { parseGroups } from '@/entities/user/lib/parse-groups';
import { User } from '@/entities/user/model/user';
import { BASE_URL } from '@/shared/constants/base';
import { secureStorage } from '@/shared/lib';
import { detectPlatform } from '@/shared/lib/platform/get-platform';
import { create } from 'zustand';

type AuthState = {
	user: User | null;
	groups: string[];
	isAuth: boolean;
	loading: boolean;
	error?: string;

	checkAuth: () => Promise<void>;
	logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	groups: [],
	isAuth: false,
	loading: true,
	error: undefined,

	// 🧠 AUTH ORCHESTRATOR
	checkAuth: async () => {
		set({ loading: true, error: undefined });

		try {
			const PLATFORM = detectPlatform();

			// 🟣 Telegram Web App
			if (PLATFORM === 'tgWeb' || PLATFORM === 'tgMobile') {
				const tg = (window as any).Telegram?.WebApp;

				if (!tg?.initDataUnsafe?.user) {
					throw new Error('TG user not found');
				}

				const user = tg.initDataUnsafe.user;

				set({
					user,
					groups: parseGroups(user.groups),
					isAuth: true,
					loading: false,
				});

				return;
			}

			// 🌐 WEB — SESSION COOKIE AUTH
			if (PLATFORM === 'web') {
				const res = await fetch(`${BASE_URL}/userinfo`, {
					credentials: 'include',
				});

				if (!res.ok) {
					throw new Error('Not authenticated');
				}

				const user: User = await res.json();

				set({
					user,
					groups: parseGroups(user.groups),
					isAuth: true,
					loading: false,
				});

				return;
			}

			// 📱 NATIVE (IOS / ANDROID) — TOKEN AUTH
			if (PLATFORM === 'ios' || PLATFORM === 'android') {
				const { accessToken, user: cachedUser } =
					await secureStorage.getAuthData();

				if (!accessToken || !cachedUser) {
					throw new Error('No stored auth');
				}

				// optimistic UI
				set({
					user: cachedUser,
					groups: parseGroups(cachedUser.groups || ''),
					isAuth: true,
					loading: false,
				});

				// validate token
				const res = await fetch(`${BASE_URL}/userinfo`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				if (!res.ok) {
					throw new Error('Token expired');
				}

				const freshUser: User = await res.json();

				await secureStorage.setItem('user_data', JSON.stringify(freshUser));

				set({
					user: freshUser,
					groups: parseGroups(freshUser.groups),
					isAuth: true,
					loading: false,
				});

				return;
			}

			throw new Error('Unknown platform');
		} catch (err: any) {
			console.log('[Auth] error:', err.message);

			set({
				user: null,
				groups: [],
				isAuth: false,
				loading: false,
				error: err.message,
			});
		}
	},

	// 🚪 LOGOUT
	logout: async () => {
		try {
			const PLATFORM = detectPlatform();

			// Web + TG → session logout
			if (PLATFORM === 'web' || PLATFORM.startsWith('tg')) {
				await fetch(`${BASE_URL}/endSession`, {
					method: 'POST',
					credentials: 'include',
				});
			}

			// Native → token logout
			if (PLATFORM === 'ios' || PLATFORM === 'android') {
				const { accessToken } = await secureStorage.getAuthData();

				if (accessToken) {
					await fetch(`${BASE_URL}/endSession`, {
						method: 'POST',
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					});
				}
			}
		} catch (e) {
			console.log('[Logout] error:', e);
		} finally {
			await secureStorage.clearAll();

			set({
				user: null,
				groups: [],
				isAuth: false,
				loading: false,
			});
		}
	},
}));
