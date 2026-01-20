// app/providers/auth/mock-auth-data.ts
import { User } from '@/features/auth/model/auth-types';

// Mock user database
export const mockUsers: Array<User & { password: string }> = [
	{
		id: '1',
		email: 'user@example.com',
		password: 'password123',
		name: 'John Doe',
		avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
		roles: ['user'],
	},
	{
		id: '2',
		email: 'admin@example.com',
		password: 'admin123',
		name: 'Admin User',
		avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
		roles: ['user'],
	},
];

// Mock API delay function
export const delay = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

// Types for API responses
export interface LoginResponse {
	user: User;
	accessToken: string;
	refreshToken: string;
}

export interface RegisterResponse {
	user: User;
	accessToken: string;
	refreshToken: string;
}

// Helper to strip password from user object
export const stripPassword = (user: User & { password: string }): User => {
	const { password, ...userWithoutPassword } = user;
	return userWithoutPassword;
};
