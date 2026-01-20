// features/auth/model/auth-types.ts
export interface User {
	id: string;
	email: string;
	name: string;
	avatar?: string;
	roles: string[];
}

export interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterData extends LoginCredentials {
	name: string;
	confirmPassword: string;
}
