// app/providers/auth/mock-auth-api.ts
import { RegisterData, User } from '@/features/auth/model/auth-types';
import {
	delay,
	LoginResponse,
	mockUsers,
	RegisterResponse,
	stripPassword,
} from './mock-auth-data';

class MockAuthAPI {
	async login(email: string, password: string): Promise<LoginResponse> {
		await delay(1000); // Simulate network delay

		const user = mockUsers.find(
			(u) => u.email === email && u.password === password,
		);

		if (!user) {
			throw new Error('Invalid email or password');
		}

		return {
			user: stripPassword(user),
			accessToken: `mock-jwt-token-${user.id}-${Date.now()}`,
			refreshToken: `mock-refresh-token-${user.id}-${Date.now()}`,
		};
	}

	async register(data: RegisterData): Promise<RegisterResponse> {
		await delay(1000); // Simulate network delay

		// Check if user already exists
		if (mockUsers.some((u) => u.email === data.email)) {
			throw new Error('User with this email already exists');
		}

		// Create new user
		const newUser: User & { password: string } = {
			id: `${mockUsers.length + 1}`,
			email: data.email,
			password: data.password,
			name: data.name,
			avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
			roles: ['user'],
		};

		mockUsers.push(newUser);

		return {
			user: stripPassword(newUser),
			accessToken: `mock-jwt-token-${newUser.id}-${Date.now()}`,
			refreshToken: `mock-refresh-token-${newUser.id}-${Date.now()}`,
		};
	}

	async getCurrentUser(accessToken: string): Promise<User> {
		await delay(500); // Simulate network delay

		// Extract user ID from token (mock parsing)
		const tokenParts = accessToken.split('-');
		const userId = tokenParts[3]; // In our mock format: mock-jwt-token-{id}-{timestamp}

		const user = mockUsers.find((u) => u.id === userId);

		if (!user) {
			throw new Error('User not found');
		}

		return stripPassword(user);
	}

	async refreshToken(
		refreshToken: string,
	): Promise<{ accessToken: string; refreshToken: string }> {
		await delay(800); // Simulate network delay

		// Extract user ID from token
		const tokenParts = refreshToken.split('-');
		const userId = tokenParts[3];

		// Verify user exists
		const userExists = mockUsers.some((u) => u.id === userId);
		if (!userExists) {
			throw new Error('Invalid refresh token');
		}

		return {
			accessToken: `mock-jwt-token-${userId}-${Date.now()}`,
			refreshToken: `mock-refresh-token-${userId}-${Date.now()}`,
		};
	}

	async logout(): Promise<void> {
		await delay(300); // Simulate network delay
		// In a real API, this would invalidate tokens on the server
		return Promise.resolve();
	}

	async updateProfile(userId: string, data: Partial<User>): Promise<User> {
		await delay(800); // Simulate network delay

		const userIndex = mockUsers.findIndex((u) => u.id === userId);

		if (userIndex === -1) {
			throw new Error('User not found');
		}

		// Update user
		mockUsers[userIndex] = {
			...mockUsers[userIndex],
			...data,
		};

		return stripPassword(mockUsers[userIndex]);
	}

	async changePassword(
		userId: string,
		currentPassword: string,
		newPassword: string,
	): Promise<void> {
		await delay(800); // Simulate network delay

		const user = mockUsers.find((u) => u.id === userId);

		if (!user) {
			throw new Error('User not found');
		}

		if (user.password !== currentPassword) {
			throw new Error('Current password is incorrect');
		}

		user.password = newPassword;
	}
}

export const mockAuthAPI = new MockAuthAPI();
