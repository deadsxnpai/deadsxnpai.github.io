import { parseGroups } from '@/entities/user/lib/parse-groups';
import type { User } from '@/entities/user/model/user';
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

			const user = await http<User>(`${BASE_URL}/userinfo`);

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
		await http(`${BASE_URL}/endSession`);
		set({ user: null, groups: [], isAuth: false });
	},
}));
