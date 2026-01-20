// app/providers/auth/auth-context.tsx

import { createContext } from 'react';

export interface User {
	id: string;
	email: string;
	name: string;
	avatar?: string;
}

export interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;

	// Methods
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	register: (email: string, password: string, name: string) => Promise<void>;
	forgotPassword: (email: string) => Promise<void>;
	updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create context with undefined default value
export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);
