import { ApolloClient, InMemoryCache } from '@apollo/client';

import { ApolloLink, HttpLink, split } from '@apollo/client';

import { BASE_URL, DOMAIN, isDev } from '@/shared/constants/base';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import * as SecureStore from 'expo-secure-store';
import { createClient } from 'graphql-ws';

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

const wsLink = new GraphQLWsLink(
	createClient({
		url: `wss://${DOMAIN}/graphql`,
		keepAlive: 10_000,
		shouldRetry(err) {
			console.log('shouldRetry', err);
			return true;
		},

		on: {
			connected: (socket, payload) => {
				console.log('connected:', socket);
				console.log('payload:', payload);
			},
			ping: (recv) => {
				console.log('ping', recv);
			},
			pong: (recv) => {
				console.log('pong', recv);
			},
			error: (err: any) => {
				console.error('Socket err', err.code);
			},
			closed: (err) => {},
		},
	}),
);

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
	devtools: {
		enabled: isDev ? true : false,
	},
});
