import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/shared/api/apollo-client';
import { AuthProvider, useAuthStore } from '@/entities/user/model/auth.context';
import { SplashScreen, Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';

const NavigationGuard = () => {
	const { isAuthenticated, loading, role, checkSession } = useAuthStore();

	useEffect(() => {
		checkSession();
	}, []);

	useEffect(() => {
		if (loading) return;

		if (!isAuthenticated) {
			router.replace('/(auth)/login');
		} else if (role === 'employee') {
			router.replace('/(employee)/home');
		} else {
			router.replace('/(student)/home');
		}
	}, [isAuthenticated, loading, role]);

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: '#fff',
				}}>
				<ActivityIndicator
					size='large'
					color='#0066cc'
				/>
			</View>
		);
	}

	return null;
};

export default function RootLayout() {
	useEffect(() => {
		SplashScreen.hideAsync();
	}, []);

	useEffect(() => {
		if (Platform.OS === 'web') {
			document.title = 'ЛК ТГУ';
		}
	}, []);

	return (
		<ApolloProvider client={apolloClient}>
			<AuthProvider>
				<NavigationGuard />
				<Stack screenOptions={{ headerShown: false }} />
				<StatusBar style='auto' />
			</AuthProvider>
		</ApolloProvider>
	);
}
