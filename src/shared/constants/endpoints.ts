import { Platform } from "react-native";
import * as Linking from 'expo-linking';

const APP_ENV: string = 'dev';

// const DOMAIN: string = 'lk.tsutmb.ru';
const DOMAIN: string = 'lk-dev.tsutmb.ru';
// export const DOMAIN: string = 'localhost:9078';

const protocol = APP_ENV === 'local' ? 'http' : 'https';
const BASE_URL_API = `${protocol}://${DOMAIN}/api`;

const dev = 'lk-dev.tsutmb.ru';
export const isDev = DOMAIN === dev;

export const getUrl = () =>
    window.location.hostname === 'localhost'
        ? 'http://localhost:8081'
        : `${protocol}://${DOMAIN}`;


export const getRedirectUri = () => {
    if (Platform.OS === 'web') {
        return window.location.origin;
    }
    return Linking.createURL('(auth)/login');
};

const BOT_URL = 'https://t.me/deadsxnpai_claw_bot/tsuapp'

export const EndPoints = {
    domain: DOMAIN,
    api: BASE_URL_API,
    wss: `${protocol === 'https' ? 'wss' : 'ws'}://${DOMAIN}/api`,
    avatar: `${BASE_URL_API}/files/avatar`,
    upload: `${BASE_URL_API}/files/commonStorage`,
    download: `${BASE_URL_API}/files/uploads`,
    recordbook: `${BASE_URL_API}/files/recordbooks`,
    reference: `${BASE_URL_API}/files/references`,
    userpic: `${BASE_URL_API}/files/userpic`,
    endSession: `${BASE_URL_API}/endSession?redirect=${getUrl()}/login`,
    bot: BOT_URL
};

export const getAuthUrl = (options?: {
    redirectUri?: string;
    params?: any;
}) => {
    const redirect = options?.redirectUri || getRedirectUri();
    let url = `${BASE_URL_API}/auth?redirect=${encodeURIComponent(redirect)}`;

    if (options?.params) {
        Object.entries(options.params).forEach(([key, value]) => {
            url += `&${key}=${encodeURIComponent(String(value))}`;
        });
    }

    return url;
};
