import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Stack, router, useSegments, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { apolloClient } from '@/shared/api';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/entities/user';
import { AuthProvider, detectPlatform } from '@/shared/lib';
import { initWebApps } from '@/shared/lib/sdk/web-apps.sdk';

SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
	const isAuthenticated = useAuthStore((state) => !!state.user);
	const loading = useAuthStore((state) => state.isLoading);
	const role = useAuthStore((state) => state.getRole());

	const segments = useSegments();

	useEffect(() => {
		if (loading) return;

		const inAuthGroup = segments[0] === '(auth)';

		if (!isAuthenticated && !inAuthGroup) {
			router.replace('/(auth)/login');
		} else if (isAuthenticated && role) {
			const expectedGroup = role === 'employee' ? '(employee)' : '(student)';
			if (segments[0] !== expectedGroup && !inAuthGroup) {
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
		if (Platform.OS === 'web') document.title = 'ЛК ТГУ';
	}, []);
	initWebApps();
	return (
		<ApolloProvider client={apolloClient}>
			<AuthProvider>
				<RootLayoutNav />
				<StatusBar style='auto' />
			</AuthProvider>
		</ApolloProvider>
	);
}
