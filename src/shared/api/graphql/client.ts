import { ApolloClient, InMemoryCache } from '@apollo/client';

import { ApolloLink, HttpLink, split } from '@apollo/client';

import { BASE_URL, DOMAIN, isDev } from '@/shared/constants/base';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import * as SecureStore from 'expo-secure-store';

export const getAccessToken = async (): Promise<Record<string, string>> => {
	try {
		const token = await SecureStore.getItemAsync('access_token');
		return token ? { 'x-access-token': token } : {};
	} catch (error) {
		console.error('Failed to get access token', error);
		return {};
	}
};

const httpLink = new HttpLink({
	uri: `${BASE_URL}/graphql`,
	credentials: 'include',
});

const wsLink = new WebSocketLink({
	uri: `ws://${DOMAIN}/graphql`,
	options: {
		reconnect: true,
		connectionParams: async () => {
			const tokenHeaders = await getAccessToken();
			return tokenHeaders;
		},
	},
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, locations, path }) => {
			console.error(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
			);
		});
	}

	if (networkError) {
		console.error('[Network error]:', networkError);
	}
});

const authLink = setContext(async (_, { headers }) => {
	const tokenHeaders = await getAccessToken();
	return {
		headers: {
			...headers,
			...tokenHeaders,
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
	connectToDevTools: isDev,
});
