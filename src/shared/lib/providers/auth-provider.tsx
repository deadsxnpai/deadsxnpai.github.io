import React, { createContext, useContext, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { EndPoints } from '@/shared/constants/endpoints';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import {
	AuthMeResponse,
	User,
	UserInfoResponse,
	UserRole,
} from '@/entities/user/model/types';
import { detectPlatform } from '../platform/get-platfrom';
import { useMe } from '@/features/auth-by-sso';

interface AuthContextType {
	isAuthenticated: boolean;
	role: UserRole | null;
	user: UserInfoResponse | User | null;
	loading: boolean;
	checkSession: () => Promise<boolean>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<UserInfoResponse | User | null>(null);
	const [loading, setLoading] = useState(true);
	const client = useApolloClient();

	const checkSession = async (): Promise<boolean> => {
		const platform = detectPlatform();
		if (platform === 'tg') {
			const { data, loading, error } = useMe();
			if (loading) {
				console.log('loading');
			}
			if (error) {
				console.error('error');
			}
			const user = mapAuthMeToUser(data);
			setUser(user);
			return true;
		}
		setLoading(true);
		try {
			let headers: HeadersInit = {
				'Content-Type': 'application/json',
			};

			if (Platform.OS !== 'web') {
				const token = await SecureStore.getItemAsync('access_token');
				if (token) {
					headers = {
						...headers,
						Authorization: `Bearer ${token}`,
					};
				} else {
					setLoading(false);
					return false;
				}
			}

			const response = await fetch(`${EndPoints.api}/userinfo`, {
				headers,
				credentials: Platform.OS === 'web' ? 'include' : 'omit',
				redirect: 'manual',
			});

			console.log('response status:', response.status);
			console.log('response url:', response.url);

			if (response.status === 200) {
				const contentType = response.headers.get('content-type');
				if (contentType && contentType.includes('application/json')) {
					const data = await response.json();
					setUser(data);
					return true;
				} else {
					console.log('Response is not JSON');
					setUser(null);
					return false;
				}
			}

			if (response.status >= 300 && response.status < 400) {
				console.log('Redirect detected, need to login');
				setUser(null);
				return false;
			}
			console.log('Server rejected token. Status:', response.status);
			setUser(null);
			return false;
		} catch (e) {
			console.error('Check session error:', e);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		setLoading(false);
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

	let role: UserRole | null = null;
	if (user) {
		if (user.groups.includes('TMB/tmb-lk-employees')) {
			role = 'employee';
		} else {
			role = 'student';
		}
	}

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: !!user,
				role,
				user,
				loading,
				checkSession,
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

export const mapAuthMeToUser = (api: AuthMeResponse): User => ({
	id: api.data.guid,
	sub: api.sub,
	email: api.email,
	email_work: api.email_work,
	groups: api.groups,
	data: {
		id: api.data.guid,
		fullName: api.data.full_name,
		firstName: api.data.name,
		lastName: api.data.surname,
		middleName: api.data.patronymic,
		birthDate: api.data.date_of_birth,
		birthPlace: api.data.place_of_birth,
		inn: api.data.inn,
		snils: api.data.snils,
		gender: api.data.sex,
		country: api.data.country_name,
		passport: {
			type: api.data.document_type,
			series: api.data.document_series,
			number: api.data.document_number,
		},
		contacts: api.data.contacts.map((c) => ({
			kind: c.kind_contact_information,
			type: c.type_contact_information,
			value: c.value?.value,
			represent: c.represent,
		})),
	},
});
