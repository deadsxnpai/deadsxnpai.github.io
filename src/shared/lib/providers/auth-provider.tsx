import React, { createContext, useContext, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { EndPoints } from '@/shared/constants/endpoints';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { AuthMeResponse } from '@/entities/user/model/types';
import { useMe } from '@/features/auth-by-sso';
import { UserRoles } from '@/entities/user/model/roles';

interface AuthContextType {
	isAuthenticated: boolean;
	role: 'employee' | 'student' | null;
	user: AuthMeResponse | null;
	loading: boolean;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { data: userData, loading: meLoading, error } = useMe();
	const [user, setUser] = useState<AuthMeResponse | null>(null);
	const client = useApolloClient();

	useEffect(() => {
		if (userData) setUser(userData);
		if (error) setUser(null);
	}, [userData, error]);

	const logout = () => {
		setUser(null);
		const clearToken = async () => {
			if (Platform.OS === 'web') {
				if (typeof window !== 'undefined') {
					localStorage.removeItem('access_token');
					window.location.assign(EndPoints.endSession);
				}
			} else {
				await SecureStore.deleteItemAsync('access_token');
				await WebBrowser.openAuthSessionAsync(EndPoints.endSession);
			}
		};

		clearToken();
		client.clearStore();
	};

	const role = user
		? user.groups.includes(UserRoles.WORKER) ||
			user.groups.includes(UserRoles.TESTER) ||
			user.groups.includes(UserRoles.EMPLOYEE)
			? 'employee'
			: 'student'
		: null;

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: !!user,
				role,
				user,
				loading: meLoading,
				logout,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthStore = () => {
	const context = useContext(AuthContext);
	if (!context)
		throw new Error('useAuthStore must be used within AuthProvider');
	return context;
};
