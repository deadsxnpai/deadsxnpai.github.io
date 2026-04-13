import { useAuth } from '@/features/auth';
import { AppDefaultTheme } from '@/shared/constants/model/theme';
import { ApolloProvider, AppContextProvider } from '@/shared/lib';
import { AuthProvider } from '@/shared/lib/providers/auth.provider';
import { ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

const InitialLayout = () => {
	const isLogged = useAuth();

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Protected guard={isLogged}>
				<Stack.Screen name='(tabs)' />
			</Stack.Protected>

			<Stack.Protected guard={!isLogged}>
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
				<ThemeProvider value={AppDefaultTheme}>
					<AuthProvider>
						<InitialLayout />
						<StatusBar style='auto' />
					</AuthProvider>
				</ThemeProvider>
			</AppContextProvider>
		</ApolloProvider>
	);
}
