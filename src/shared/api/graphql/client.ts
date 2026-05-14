import { EndPoints, isDev } from '@/shared/constants/model/base';
import { getMaxInitData, initMaxWebApp } from '@/shared/lib/max/max.sdk';
import {
	detectPlatform,
	isMaxPlatform,
	isTgPlatform,
} from '@/shared/lib/platform/get-platform';
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
import { retrieveRawInitData } from '@tma.js/sdk';
import * as SecureStore from 'expo-secure-store';
import { createClient } from 'graphql-ws';

const getCookie = (name: string) => {
	if (typeof document === 'undefined') return null;
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	return match ? decodeURIComponent(match[2]) : null;
};

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
	try {
		const platform = detectPlatform();

		// Telegram platform
		if (isTgPlatform(platform)) {
			const initData = retrieveRawInitData();
			if (initData) {
				return { Authorization: `tma ${initData}` };
			}
			console.warn('No initData in Telegram WebApp');
			return {};
		}

		// Max platform
		if (isMaxPlatform(platform)) {
			await initMaxWebApp();
			const initData = getMaxInitData();
			if (initData) {
				console.log('Using Max auth with initData');
				return { Authorization: `max ${initData}` };
			}
			console.warn('No initData in Max WebApp');
			return {};
		}

		// Web platform
		if (platform === 'web') {
			const token = getCookie('access_token');
			if (token) {
				return { 'access-token': token };
			}

			const localToken = localStorage.getItem('access_token');
			if (localToken) {
				return { 'access-token': localToken };
			}

			return {};
		}
		const token = await SecureStore.getItemAsync('access_token');
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
