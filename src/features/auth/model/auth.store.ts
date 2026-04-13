import { User } from '@/entities/user';
import { create } from 'zustand';

interface AuthState {
	user: User | null;
	role: string | null;
	isLogged: boolean;
	setUser: (user: User | null) => void;
	setRole: (role: string | null) => void;
	logout: () => void; // Add logout
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	role: null,
	isLogged: false,
	setUser: (user) => set({ user, isLogged: !!user }),
	setRole: (role) => set({ role }),
	logout: () => set({ user: null, role: null, isLogged: false }),
}));
