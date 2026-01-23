import { parseGroups } from '@/entities/user/lib/parse-groups';
import { User } from '@/entities/user/model/user';
import { http } from '@/shared/api';
import { BASE_URL } from '@/shared/constants/base';
import { detectPlatform } from '@/shared/lib/platform/get-platform';
import { create } from 'zustand';

type AuthState = {
	user: User | null;
	groups: string[];
	isAuth: boolean;
	loading: boolean;
	checkAuth: () => Promise<void>;
	logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	groups: [],
	isAuth: false,
	loading: true,

	checkAuth: async () => {
		try {
			console.log('[Auth] Starting auth process');
			set({ loading: true });
			const PLATFORM = detectPlatform();
			// Telegram Web App
			if (PLATFORM === 'tgWeb' || PLATFORM === 'tgMobile') {
				console.log('[Auth] Starting auth to TG app');
				const tg = (window as any).Telegram?.WebApp;

				if (tg && tg.initData) {
					const user = tg.initDataUnsafe.user;
					set({
						user,
						groups: parseGroups(user.groups || 'guest'),
						isAuth: true,
						loading: false,
					});
					return;
				}
			} else if (PLATFORM === 'ios' || PLATFORM === 'android') {
				console.log('[Auth] Starting auth to mobile app');
				set({ isAuth: true, loading: false });
			} else if (PLATFORM === 'web') {
				console.log('[Auth] Starting auth to web mobile app');
				//todo realize how to auth check
				set({
					isAuth: true,
					loading: false,
				});
			}
		} catch (err) {
			console.log(`[Auth] Error ${err}`);
			set({ user: null, groups: [], isAuth: false });
		} finally {
			set({ loading: false });
		}
	},

	logout: async () => {
		try {
			await http(`${BASE_URL}/endSession`);
		} catch {}
		set({ user: null, groups: [], isAuth: false });
	},
}));
