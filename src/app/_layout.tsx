import { ApolloProvider } from '@apollo/client';
import { Stack, router, useSegments, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { apolloClient } from '@/shared/api';
import { AuthProvider, useAuthStore } from '@/entities/user';
import { StatusBar } from 'expo-status-bar';

// Предотвращаем скрытие сплеш-скрина до завершения загрузки
SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
	const { isAuthenticated, loading, role, checkSession } = useAuthStore();
	const segments = useSegments();

	useEffect(() => {
		checkSession();
	}, []);

	useEffect(() => {
		if (loading) return;
		if (isAuthenticated && role === null) return;

		const currentGroup = segments[0]; // Например, "(employee)" или "(student)"
		const inAuthGroup = currentGroup === '(auth)';

		// 1. Если не залогинен и не в группе авторизации — на логин
		if (!isAuthenticated && !inAuthGroup) {
			router.replace('/(auth)/login');
		} else if (isAuthenticated) {
			const expectedGroup = role === 'employee' ? '(employee)' : '(student)';

			if (currentGroup !== expectedGroup && !inAuthGroup) {
				router.replace(`/${expectedGroup}` as any);
			}
		}
	}, [isAuthenticated, loading, role, segments]);

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size='large' />
			</View>
		);
	}

	return <Stack screenOptions={{ headerShown: false }} />;
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
				<RootLayoutNav />
				<StatusBar style='auto' />
			</AuthProvider>
		</ApolloProvider>
	);
}
