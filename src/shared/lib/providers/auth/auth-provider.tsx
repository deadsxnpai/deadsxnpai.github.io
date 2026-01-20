// app/providers/auth/auth-provider.tsx

import { RegisterData, User } from '@/features/auth/model/auth-types';

import { mockAuthAPI } from '@/shared/lib/providers/auth/mock/mock-api';
import { useRouter, useSegments } from 'expo-router';
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { secureStorage } from '../storage/secure-storage';

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (data: RegisterData) => Promise<void>;
	logout: () => Promise<void>;
	updateUser: (userData: Partial<User>) => void;
	updateProfile: (data: Partial<User>) => Promise<void>;
	changePassword: (
		currentPassword: string,
		newPassword: string,
	) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const router: any = useRouter();
	const segments: any = useSegments();

	const initializeAuth = useCallback(async () => {
		try {
			const { accessToken, user: storedUser } =
				await secureStorage.getAuthData();

			if (accessToken && !storedUser) {
				// Fetch fresh user data if we have token but no user
				const freshUser = await mockAuthAPI.getCurrentUser(accessToken);
				setUser(freshUser);
				// Update stored user data
				await secureStorage.saveAuthData(accessToken, '', freshUser);
			} else if (accessToken && storedUser) {
				// Use stored user data
				setUser(storedUser);
			}
		} catch (error) {
			console.error('Auth initialization error:', error);
			// Don't clear auth data on initialization error
			// Let the route protection handle it
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		initializeAuth();
	}, [initializeAuth]);

	// Protect routes
	useEffect(() => {
		const inAuthGroup = segments[0] === '(auth)';

		if (!isLoading) {
			if (user && inAuthGroup) {
				// Redirect authenticated users away from auth pages
				router.replace('/(app)');
			} else if (!user && !inAuthGroup) {
				// Redirect unauthenticated users to login
				router.replace('/(auth)/login');
			}
		}
	}, [user, segments, isLoading, router]);

	const login = useCallback(
		async (email: string, password: string) => {
			try {
				setIsLoading(true);

				// Call mock API
				const { user, accessToken, refreshToken } = await mockAuthAPI.login(
					email,
					password,
				);

				// Save auth data
				await secureStorage.saveAuthData(accessToken, refreshToken, user);

				// Update state
				setUser(user);

				// Navigate to app
				router.replace('/(app)');
			} catch (error: any) {
				console.error('Login error:', error);
				throw new Error(error.message || 'Login failed');
			} finally {
				setIsLoading(false);
			}
		},
		[router],
	);

	const register = useCallback(
		async (data: RegisterData) => {
			try {
				setIsLoading(true);

				// Call mock API
				const { user, accessToken, refreshToken } =
					await mockAuthAPI.register(data);

				// Save auth data
				await secureStorage.saveAuthData(accessToken, refreshToken, user);

				// Update state
				setUser(user);

				// Navigate to app
				router.replace('/(app)');
			} catch (error: any) {
				console.error('Registration error:', error);
				throw new Error(error.message || 'Registration failed');
			} finally {
				setIsLoading(false);
			}
		},
		[router],
	);

	const logout = useCallback(async () => {
		try {
			setIsLoading(true);

			// Call logout API
			await mockAuthAPI.logout();

			// Clear storage
			await secureStorage.clearAuthData();

			// Reset user state
			setUser(null);

			// Redirect to login
			router.replace('/(auth)/login');
		} catch (error) {
			console.error('Logout error:', error);
			// Still clear local data even if API call fails
			await secureStorage.clearAuthData();
			setUser(null);
			router.replace('/(auth)/login');
		} finally {
			setIsLoading(false);
		}
	}, [router]);

	const updateUser = useCallback((userData: Partial<User>) => {
		setUser((prev) => (prev ? { ...prev, ...userData } : null));
	}, []);

	const updateProfile = useCallback(
		async (data: Partial<User>) => {
			if (!user) throw new Error('Not authenticated');

			try {
				setIsLoading(true);

				// Call API to update profile
				const updatedUser = await mockAuthAPI.updateProfile(user.id, data);

				// Update local state
				setUser(updatedUser);

				// Update stored user data
				const authData = await secureStorage.getAuthData();
				if (authData.accessToken) {
					await secureStorage.saveAuthData(
						authData.accessToken,
						authData.refreshToken || '',
						updatedUser,
					);
				}
			} catch (error: any) {
				console.error('Update profile error:', error);
				throw new Error(error.message || 'Failed to update profile');
			} finally {
				setIsLoading(false);
			}
		},
		[user],
	);

	const changePassword = useCallback(
		async (currentPassword: string, newPassword: string) => {
			if (!user) throw new Error('Not authenticated');

			try {
				setIsLoading(true);

				// Call API to change password
				await mockAuthAPI.changePassword(user.id, currentPassword, newPassword);
			} catch (error: any) {
				console.error('Change password error:', error);
				throw new Error(error.message || 'Failed to change password');
			} finally {
				setIsLoading(false);
			}
		},
		[user],
	);

	const value: AuthContextType = {
		user,
		isLoading,
		isAuthenticated: !!user,
		login,
		register,
		logout,
		updateUser,
		updateProfile,
		changePassword,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
