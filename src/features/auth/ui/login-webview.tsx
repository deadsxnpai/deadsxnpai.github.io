import { EndPoints } from '@/shared/constants/base';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAuthStore } from '../model/auth.store';

export const LoginWebView = () => {
	const checkAuth = useAuthStore((s) => s.checkAuth);
	const hasCheckedRef = useRef(false);

	// WEB
	if (Platform.OS === 'web') {
		useEffect(() => {
			if (hasCheckedRef.current) return;
			hasCheckedRef.current = true;

			const url = new URL(window.location.href);
			const code = url.searchParams.get('sc'); // если есть code от SSO

			if (code || url.pathname === '/') {
				checkAuth().finally(() => {
					const isAuthed = useAuthStore.getState().isAuth;
					if (!isAuthed) {
						window.location.href = EndPoints.auth();
					}
				});
			} else {
				window.location.href = EndPoints.auth();
			}
		}, []);

		return null;
	}

	// NATIVE
	return (
		<WebView
			source={{ uri: EndPoints.auth() }}
			onNavigationStateChange={(nav) => {
				if (
					!hasCheckedRef.current &&
					(nav.url.startsWith('tsumobile://') || nav.url.includes('localhost'))
				) {
					hasCheckedRef.current = true;
					checkAuth();
				}
			}}
		/>
	);
};
