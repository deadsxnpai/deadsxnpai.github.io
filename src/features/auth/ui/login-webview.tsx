import { EndPoints } from '@/shared/config/base';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAuthStore } from '../model/auth.store';

export const LoginWebView = () => {
	const checkAuth = useAuthStore((s) => s.checkAuth);

	if (Platform.OS === 'web') {
		useEffect(() => {
			checkAuth();
		}, []);
		return null;
	}

	return (
		<WebView
			source={{ uri: EndPoints.auth }}
			onNavigationStateChange={(nav) => {
				if (
					nav.url.startsWith('tsumobile://') ||
					nav.url.includes('localhost')
				) {
					checkAuth();
				}
			}}
		/>
	);
};
