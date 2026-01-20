// store/authStore.ts
import { create } from 'zustand';
import { secureStorage } from './secure-storage';

interface AuthState {
	isAuthenticated: boolean;
	isLoading: boolean;
	user: any | null;
	initializeAuth: () => Promise<void>;
	login: (token: string) => Promise<void>;
	logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
	isAuthenticated: false,
	isLoading: true,
	user: null,

	initializeAuth: async () => {
		try {
			const authData = await secureStorage.getAuthData();
			if (authData.accessToken) {
				set({ isAuthenticated: true, user: authData.user, isLoading: false });
			} else {
				set({ isLoading: false });
			}
		} catch {
			set({ isLoading: false });
		}
	},

	login: async (token: string) => {
		await secureStorage.saveAuthData(token, '', {});
		set({ isAuthenticated: true, user: {} });
	},

	logout: async () => {
		await secureStorage.clearAuthData();
		set({ isAuthenticated: false, user: null });
	},
}));
