import { useAuth, useAuthStore } from '@/features/auth';
import { ApolloProvider, AppContextProvider } from '@/shared/lib';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

const InitialLayoyt = () => {
	const { isAuth, loading } = useAuth();
	const checkAuth = useAuthStore((s) => s.checkAuth);

	useEffect(() => {
		checkAuth();
	}, []);

	if (loading) return null;
	console.log('isAuth', isAuth);
	const test = true;
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Protected guard={test}>
				<Stack.Screen name='(tabs)' />
			</Stack.Protected>

			<Stack.Protected guard={!test}>
				<Stack.Screen name='(auth)' />
			</Stack.Protected>

			<Stack.Screen name='+not-found' />
		</Stack>
	);
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
		<ApolloProvider>
			<AppContextProvider>
				<ThemeProvider value={DefaultTheme}>
					<InitialLayoyt />
					<StatusBar style='auto' />
				</ThemeProvider>
			</AppContextProvider>
		</ApolloProvider>
	);
}
