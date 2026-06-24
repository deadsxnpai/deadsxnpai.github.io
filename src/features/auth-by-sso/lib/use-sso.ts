import { useState } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import { getAuthUrl, EndPoints, getRedirectUri } from '@/shared/constants/endpoints';
import { useAuthStore } from '@/shared/lib/providers/auth-provider';


export const useSso = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { checkSession } = useAuthStore();

    const handleSsoLogin = async () => {
        setIsLoading(true);

        const redirectUri = getRedirectUri();

        const authUrl = getAuthUrl({
            redirectUri,
            params: { prompt: 'login' }
        });

        try {
            if (Platform.OS === 'web') {
                window.location.href = authUrl;
            } else {
                const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri, {
                    showInRecents: true,
                    preferEphemeralSession: true,
                });

                if (result.type === 'success' && result.url) {
                    const parsedUrl = Linking.parse(result.url);
                    const sessionCode = parsedUrl.queryParams?.sc as string;
                    if (sessionCode) {
                        const response = await fetch(
                            `${EndPoints.api}/mobile?sc=${sessionCode}&redirect=${encodeURIComponent(redirectUri)}`,
                            {
                                method: 'GET',
                                credentials: 'include',
                                redirect: 'manual',
                            }
                        );

                        let setCookieStr = '';
                        if (typeof response.headers.getSetCookie === 'function') {
                            setCookieStr = response.headers.getSetCookie().join(', ');
                        } else {
                            setCookieStr = response.headers.get('set-cookie') || '';
                        }

                        if (setCookieStr) {
                            const match = setCookieStr.match(/access_token=([^;]+)/);
                            const token = match ? match[1] : null;

                            if (token) {
                                SecureStore.setItemAsync('access_token', token);
                            }
                        }
                    }

                    const isOK = await checkSession();

                    console.log('➡️ checkSession', isOK);

                }
            }
        } catch (error) {
            console.error('OIDC Auth Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { handleSsoLogin, isLoading };
};