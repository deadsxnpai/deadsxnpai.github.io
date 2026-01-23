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

	// 🔐 backend session check (RTKQ-like)
	validateLogin: async () => {
		try {
			const res = await fetch(`${BASE_URL}/userinfo`, {
				credentials: 'include',
			});
			if (!res.ok) {
				throw new Error('Not authenticated');
			}
			return res.json();
		} catch (e) {
			console.log(e);
		}
	},

	// 🧠 auth orchestrator
	checkAuth: async () => {
		console.log('[Auth] checkAuth start');
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
					groups: parseGroups(user.groups || 'guest'),
					isAuth: true,
					loading: false,
				});
				return;
			}

			// 📱 Mobile / 🌐 Web → backend
			if (PLATFORM === 'ios' || PLATFORM === 'android' || PLATFORM === 'web') {
				const user = await get().validateLogin();

				set({
					user,
					groups: parseGroups(user.groups || 'guest'),
					isAuth: true,
					loading: false,
				});
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
			await http(`${BASE_URL}/endSession`);
		} catch {}

		set({
			user: null,
			groups: [],
			isAuth: false,
		});
	},
}));
