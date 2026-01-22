import { parseGroups } from '@/entities/user/lib/parse-groups';
import type { User } from '@/entities/user/model/user';
import { http } from '@/shared/api';
import { BASE_URL_API } from '@/shared/config/base';
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
		set({ loading: true });
		try {
			const user: any = await http<User>(`${BASE_URL_API}/userinfo`);
			set({
				user,
				groups: parseGroups(user.groups),
				isAuth: true,
			});
		} catch {
			set({
				user: null,
				groups: [],
				isAuth: false,
			});
		} finally {
			set({ loading: false });
		}
	},

	logout: async () => {
		await http(`${BASE_URL_API}/endSession`);
		set({ user: null, groups: [], isAuth: false });
	},
}));
