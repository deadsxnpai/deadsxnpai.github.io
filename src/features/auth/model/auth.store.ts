import { parseGroups } from '@/entities/user/lib/parse-groups';
import { User } from '@/entities/user/model/user';
import { http } from '@/shared/api/http/http';
import { detectPlatform } from '@/shared/lib/platform/get-platform';
import { create } from 'zustand';

type AuthState = {
	user: User | null;
	groups: string[];
	isAuth: boolean;
	loading: boolean;
	error?: string;

	checkAuth: () => Promise<void>;
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
			set({
				user: null,
				groups: [],
				isAuth: false,
				loading: false,
				error: err.message,
			});
		}
	},
}));
