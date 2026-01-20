// // src/auth/useAuth.ts
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as AuthSession from 'expo-auth-session';
// import * as Crypto from 'expo-crypto';
// import * as WebBrowser from 'expo-web-browser';
// import { useCallback, useEffect, useState } from 'react';
// import { Alert, Platform } from 'react-native';

// // Конфигурация вашего SSO
// const ssoConfig: SSOConfig = {
// 	authorizationEndpoint: 'https://ваш-sso.com/oauth/authorize',
// 	tokenEndpoint: 'https://ваш-sso.com/oauth/token',
// 	clientId: Platform.select({
// 		web: 'ваш-web-client-id',
// 		android: 'ваш-android-client-id',
// 		default: 'ваш-default-client-id',
// 	})!,
// 	redirectUri: AuthSession.makeRedirectUri({
// 		scheme: 'ваша-схема',
// 		path: 'auth/callback',
// 	}),
// 	scopes: ['openid', 'profile', 'email'],
// };

// export const useAuth = () => {
// 	const [user, setUser] = useState(null);
// 	const [isLoading, setIsLoading] = useState(true);

// 	// GraphQL мутации
// 	const [loginWithSSO] = useLoginWithSSOMutation();
// 	const [verifyToken] = useVerifyTokenLazyQuery();

// 	// PKCE для безопасности
// 	const generateCodeVerifier = async (): Promise<string> => {
// 		const randomBytes = Crypto.getRandomBytes(32);
// 		return base64URLEncode(randomBytes);
// 	};

// 	const generateCodeChallenge = async (
// 		codeVerifier: string,
// 	): Promise<string> => {
// 		const digest = await Crypto.digestStringAsync(
// 			Crypto.CryptoDigestAlgorithm.SHA256,
// 			codeVerifier,
// 		);
// 		return base64URLEncode(digest);
// 	};

// 	// Функция входа
// 	const signIn = useCallback(async (): Promise<void> => {
// 		try {
// 			setIsLoading(true);

// 			if (Platform.OS === 'web') {
// 				await signInWeb();
// 			} else {
// 				await signInMobile();
// 			}
// 		} catch (error) {
// 			console.error('Sign in error:', error);
// 			Alert.alert('Ошибка входа', 'Не удалось войти через SSO');
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	}, []);

// 	// Web версия
// 	const signInWeb = async () => {
// 		const [request, response, promptAsync] = AuthSession.useAuthRequest(
// 			{
// 				clientId: ssoConfig.clientId,
// 				redirectUri: ssoConfig.redirectUri,
// 				scopes: ssoConfig.scopes,
// 				responseType: AuthSession.ResponseType.Code,
// 			},
// 			{
// 				authorizationEndpoint: ssoConfig.authorizationEndpoint,
// 				tokenEndpoint: ssoConfig.tokenEndpoint,
// 			},
// 		);

// 		await promptAsync();

// 		if (response?.type === 'success') {
// 			await handleAuthResponse(response.params.code);
// 		}
// 	};

// 	// Mobile версия (Android/iOS)
// 	const signInMobile = async () => {
// 		const codeVerifier = await generateCodeVerifier();
// 		const codeChallenge = await generateCodeChallenge(codeVerifier);

// 		const authUrl = `${ssoConfig.authorizationEndpoint}?${new URLSearchParams({
// 			response_type: 'code',
// 			client_id: ssoConfig.clientId,
// 			redirect_uri: ssoConfig.redirectUri,
// 			scope: ssoConfig.scopes.join(' '),
// 			code_challenge: codeChallenge,
// 			code_challenge_method: 'S256',
// 			state: Math.random().toString(36).substring(7),
// 		})}`;

// 		const result = await WebBrowser.openAuthSessionAsync(
// 			authUrl,
// 			ssoConfig.redirectUri,
// 			{
// 				showTitle: false,
// 				enableBarCollapsing: true,
// 			},
// 		);

// 		if (result.type === 'success') {
// 			const url = new URL(result.url);
// 			const code = url.searchParams.get('code');
// 			if (code) {
// 				await handleAuthResponse(code);
// 			}
// 		}
// 	};

// 	// Обработка ответа от SSO
// 	const handleAuthResponse = async (code: string) => {
// 		try {
// 			// Получаем токены от SSO провайдера
// 			const tokenResponse = await fetch(ssoConfig.tokenEndpoint, {
// 				method: 'POST',
// 				headers: { 'Content-Type': 'application/json' },
// 				body: JSON.stringify({
// 					grant_type: 'authorization_code',
// 					code,
// 					client_id: ssoConfig.clientId,
// 					redirect_uri: ssoConfig.redirectUri,
// 					client_secret: 'ваш-client-secret', // если требуется
// 				}),
// 			});

// 			const ssoTokens = await tokenResponse.json();

// 			// Отправляем на наш GraphQL бэкенд
// 			const { data } = await loginWithSSO({
// 				variables: {
// 					input: {
// 						provider: 'ваш-sso',
// 						accessToken: ssoTokens.access_token,
// 						idToken: ssoTokens.id_token,
// 					},
// 				},
// 			});

// 			if (data?.loginWithSSO) {
// 				// Сохраняем токены
// 				await AsyncStorage.setItem('access_token', data.loginWithSSO.token);
// 				if (data.loginWithSSO.refreshToken) {
// 					await AsyncStorage.setItem(
// 						'refresh_token',
// 						data.loginWithSSO.refreshToken,
// 					);
// 				}

// 				// Обновляем состояние
// 				setUser(data.loginWithSSO.user);
// 			}
// 		} catch (error) {
// 			console.error('Auth response error:', error);
// 			throw error;
// 		}
// 	};

// 	// Проверка существующей сессии
// 	const checkAuth = useCallback(async (): Promise<boolean> => {
// 		try {
// 			const token = await AsyncStorage.getItem('access_token');

// 			if (!token) {
// 				setIsLoading(false);
// 				return false;
// 			}

// 			const { data } = await verifyToken();

// 			if (data?.verifyToken?.user) {
// 				setUser(data.verifyToken.user);
// 				setIsLoading(false);
// 				return true;
// 			}
// 		} catch (error) {
// 			console.error('Check auth error:', error);
// 			// Токен невалиден, удаляем
// 			await AsyncStorage.removeItem('access_token');
// 		}

// 		setIsLoading(false);
// 		return false;
// 	}, [verifyToken]);

// 	// Выход
// 	const signOut = useCallback(async (): Promise<void> => {
// 		try {
// 			// Удаляем локальные токены
// 			await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
// 			setUser(null);

// 			// Логаут из SSO (опционально)
// 			if (Platform.OS === 'web') {
// 				window.location.href = 'https://ваш-sso.com/logout';
// 			} else {
// 				await WebBrowser.openBrowserAsync('https://ваш-sso.com/logout');
// 			}
// 		} catch (error) {
// 			console.error('Logout error:', error);
// 		}
// 	}, []);

// 	// При монтировании проверяем авторизацию
// 	useEffect(() => {
// 		checkAuth();
// 	}, [checkAuth]);

// 	return {
// 		user,
// 		isLoading,
// 		isAuthenticated: !!user,
// 		signIn,
// 		signOut,
// 		checkAuth,
// 	};
// };

// // Утилиты для PKCE
// const base64URLEncode = (buffer: Uint8Array): string => {
// 	return btoa(String.fromCharCode(...Array.from(buffer)))
// 		.replace(/\+/g, '-')
// 		.replace(/\//g, '_')
// 		.replace(/=/g, '');
// };
