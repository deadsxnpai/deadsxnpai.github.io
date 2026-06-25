import { EndPoints, isDev } from '@/shared/constants/endpoints';
import {
    ApolloClient,
    ApolloLink,
    HttpLink,
    InMemoryCache,
    split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { Platform } from 'react-native';
import { getAuthData } from '../lib/sdk/web-apps.sdk';


export const getAuthHeaders = async (): Promise<Record<string, string>> => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        return { Authorization: `tma ${getAuthData}` };
    }

    try {
        let token: string | null = null;
        if (Platform.OS === 'web') {
            token = localStorage.getItem('access_token');
        } else {
            const SecureStore = require('expo-secure-store');
            token = await SecureStore.getItemAsync('access_token');
        }
        return token ? { 'x-access-token': token } : {};
    } catch (error) {
        console.error('Failed to get auth headers', error);
        return {};
    }
};

const httpLink = new HttpLink({
    uri: `${EndPoints.api}/graphql`,
    credentials: 'include',
    fetchOptions: {
        credentials: 'include',
    },
});

// На вебе wsClient должен инициализироваться только если мы в контексте браузера
const wsClient = createClient({
    url: EndPoints.wss,
    keepAlive: 10000,
    connectionParams: async () => {
        const headers = await getAuthHeaders();
        return headers;
    },
    on: {
        connecting: () => console.log('WS connecting'),
        connected: () => console.log('WS connected'),
        closed: (e) => console.log('WS closed', e),
        error: (e) => console.log('WS error', e),
    },
});

const wsLink = new GraphQLWsLink(wsClient);

const errorLink = onError(({ error }: any) => {
    if (!error) return;
    if ('errors' in error) {
        error.errors.forEach(({ message, locations, path }: any) => {
            console.error(`[GraphQL error]: ${message}`, locations, path);
        });
    } else {
        console.error('[Network error]:', error);
    }
});

const authLink = setContext(async (_, { headers }) => {
    const authHeaders = await getAuthHeaders();
    return {
        headers: {
            ...headers,
            ...authHeaders,
        },
    };
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

export const apolloClient = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, splitLink]),
    cache: new InMemoryCache(),
    queryDeduplication: false,
    devtools: {
        enabled: isDev,
    },
});