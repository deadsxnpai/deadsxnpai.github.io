import { useAuthStore } from '@/features';
import { Loader } from '@/shared';
import { ApolloProvider, AppContextProvider } from '@/shared/lib';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

const InitialLayoyt = () => {
	const { isAuth, loading, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, []);

	if (loading) return <Loader />;

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Protected guard={isAuth}>
				<Stack.Screen name='(tabs)' />
			</Stack.Protected>

			<Stack.Protected guard={!isAuth}>
				<Stack.Screen name='(auth)' />
				<Stack.Screen name='(telegram)' />
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
