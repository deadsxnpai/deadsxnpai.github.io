import { ApolloProvider } from '@/shared/lib/providers/apollo';
import { AppContextProvider } from '@/shared/lib/providers/app-context';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export const unstable_settings = {
	anchor: '(app)',
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
			{/* <AuthProvider> */}
			<AppContextProvider>
				<ThemeProvider value={DefaultTheme}>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name='(auth)' />
						<Stack.Screen name='(app)' />
					</Stack>
					<StatusBar style='auto' />
				</ThemeProvider>
			</AppContextProvider>
			{/* </AuthProvider> */}
		</ApolloProvider>
	);
}
