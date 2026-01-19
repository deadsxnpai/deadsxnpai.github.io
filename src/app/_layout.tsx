import { apolloClient } from '@/shared/api/base';
import { ApolloProvider } from '@apollo/client';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	return (
		<ApolloProvider client={apolloClient}>
			<ThemeProvider value={DefaultTheme}>
				<Stack>
					<Stack.Screen
						name='(tabs)'
						options={{ headerShown: false }}
					/>
				</Stack>
				<StatusBar style='auto' />
			</ThemeProvider>
		</ApolloProvider>
	);
}
