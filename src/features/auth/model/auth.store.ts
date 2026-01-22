import { parseGroups } from '@/entities/user/lib/parse-groups';
import { User } from '@/entities/user/model/user';
import { http } from '@/shared/api';
import { BASE_URL } from '@/shared/config/base';
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
			set({ loading: true });

			// Telegram Web App
			const tg = (window as any).Telegram?.WebApp;

			if (tg && tg.initData) {
				const user = tg.initDataUnsafe.user;
				set({
					user,
					groups: parseGroups(user.groups || 'guest'),
					isAuth: true,
				});
				return;
			}

			// обычный SSO (WebView / Mobile)
			// const user: any = await http<User>(`${BASE_URL_API}/userinfo`);
			// set({
			// 	user,
			// 	groups: parseGroups(user.groups || 'guest'),
			// 	isAuth: true,
			// });

			set({ isAuth: true, loading: false });
		} catch (err) {
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
