import { useState } from 'react';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { EndPoints, getAuthUrl, getRedirectUri } from '@/shared/constants/endpoints';
import { getAuthData } from '@/shared/lib/sdk/web-apps.sdk';

export const useMaxLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleMaxLogin = async () => {
        setIsLoading(true);
        setError(null);

        try {

            const initData = getAuthData();
            const authUrl = getAuthUrl({
                redirectUri: EndPoints.bot_max,
                params: {
                    maxInitData: initData,
                },
            });

            if (Platform.OS === 'web') {
                const WebApp = (window as any)?.WebApp;

                if (WebApp) {
                    WebApp.openLink(authUrl);
                } else {
                    window.location.href = authUrl;
                }
            } else {
                // Mobile platforms - use Linking
                const canOpen = await Linking.canOpenURL(authUrl);
                if (canOpen) {
                    await Linking.openURL(authUrl);
                } else {
                    setError('Не удалось открыть ссылку для входа');
                }
            }
        } catch (error) {
            console.error('Max Auth Error:', error);
            setError('Ошибка при формировании ссылки для входа.');
        } finally {
            setIsLoading(false);
        }
    };

    return { handleMaxLogin, isLoading, error };
};