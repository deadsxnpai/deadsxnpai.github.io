import { parseGroups } from '@/entities/user/lib/parse-groups';
import { User } from '@/entities/user/model/user';
import { BASE_URL } from '@/shared/constants/base';
import { getCookie, secureStorage } from '@/shared/lib';
import { detectPlatform } from '@/shared/lib/platform/get-platform';
import { create } from 'zustand';

type AuthState = {
	user: User | null;
	groups: string[];
	isAuth: boolean;
	loading: boolean;
	error?: string;

	checkAuth: () => Promise<void>;
	validateLogin: () => Promise<User>;
	logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	groups: [],
	isAuth: false,
	loading: true,
	error: undefined,

	// 🔐 backend session check with token handling
	// 🔐 backend session check with token handling
	validateLogin: async () => {
		try {
			// First check if token exists in cookies
			const cookieToken = getCookie('access_token');
			console.log('cookieToken', cookieToken);
			const { accessToken: storedToken } = await secureStorage.getAuthData();

			// Use cookie token if available and different from stored
			let tokenToUse = storedToken;
			if (cookieToken && cookieToken !== storedToken) {
				tokenToUse = cookieToken;
				// Update secure storage with cookie token
				const { user } = await secureStorage.getAuthData();
				await secureStorage.saveAuthData(cookieToken, '', user);
			}

			const headers: Record<string, string> = {
				'Content-Type': 'application/json',
			};

			if (tokenToUse) {
				headers['Authorization'] = `Bearer ${tokenToUse}`;
			}

			const res = await fetch(`${BASE_URL}/userinfo`, {
				credentials: 'include', // This sends cookies automatically
				headers,
			});

			if (!res.ok) {
				throw new Error('Not authenticated');
			}

			const userData = await res.json();

			// Check if response contains new tokens (for token refresh scenarios)
			if (userData.tokens) {
				await secureStorage.saveAuthData(
					userData.tokens.accessToken,
					userData.tokens.refreshToken,
					userData.user,
				);
			} else if (cookieToken && !userData.tokens) {
				// If using cookie auth and no tokens in response, just update user data
				if (userData.uid) {
					await secureStorage.setItem('user_data', JSON.stringify(userData));
				}
			}

			return userData;
		} catch (e) {
			console.log(e);
			throw e;
		}
	},

	// 🧠 auth orchestrator
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

			// 📱 Mobile / 🌐 Web → backend with token
			if (PLATFORM === 'ios' || PLATFORM === 'android' || PLATFORM === 'web') {
				const cachedAuth = await secureStorage.getAuthData();
				if (cachedAuth.accessToken && cachedAuth.user) {
					// Use cached data while fetching fresh data
					set({
						user: cachedAuth.user,
						groups: parseGroups(cachedAuth.user.groups || ''),
						isAuth: true,
						loading: false,
					});
				}

				try {
					const user = await get().validateLogin();

					if (!cachedAuth.user || cachedAuth.user.uid !== user.uid) {
						await secureStorage.setItem('user_data', JSON.stringify(user));
					}

					set({
						user,
						groups: parseGroups(user.groups),
						isAuth: true,
						loading: false,
					});
				} catch (error) {
					// If validation fails but we have cached data, keep user logged in
					if (cachedAuth.accessToken) {
						console.log('[Auth] Using cached auth data');
						set({
							loading: false,
							// Keep existing auth state from cache
						});
					} else {
						throw error;
					}
				}
				return;
			}

			throw new Error('Unknown platform');
		} catch (err: any) {
			console.log('[Auth] error', err.message);
			set({
				user: null,
				groups: [],
				isAuth: false,
				loading: false,
				error: err.message,
			});
		}
	},

	logout: async () => {
		try {
			// Get current tokens before logout
			const { accessToken } = await secureStorage.getAuthData();

			// Call logout endpoint if we have a token
			if (accessToken) {
				await fetch(`${BASE_URL}/endSession`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				});
			}
		} catch (e) {
			console.log('Logout error', e);
		} finally {
			await secureStorage.clearAll();
			set({
				user: null,
				groups: [],
				isAuth: false,
			});
		}
	},
}));
