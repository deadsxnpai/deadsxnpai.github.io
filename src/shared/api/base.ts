import {
	ApolloClient,
	ApolloLink,
	HttpLink,
	InMemoryCache,
} from '@apollo/client';

import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';

import { createClient } from 'graphql-ws';
import EncryptedStorage from 'react-native-encrypted-storage';

import { BASE_URL, DOMAIN, isDev } from '@/shared/constants/base';

/* -------------------------------------------------------------------------- */
/*                               Auth Helpers                                 */
/* -------------------------------------------------------------------------- */

export const getAccessToken = async (): Promise<Record<string, string>> => {
	try {
		const token = await EncryptedStorage.getItem('access_token');
		return token ? { 'x-access-token': token } : {};
	} catch (error) {
		console.error('Failed to get access token', error);
		return {};
	}
};

/* -------------------------------------------------------------------------- */
/*                                HTTP Link                                   */
/* -------------------------------------------------------------------------- */

const httpLink = new HttpLink({
	uri: `${BASE_URL}/graphql`,
	credentials: 'include',
});

/* -------------------------------------------------------------------------- */
/*                              WebSocket Link                                */
/* -------------------------------------------------------------------------- */

const wsLink = new GraphQLWsLink(
	createClient({
		url: `wss://${DOMAIN}/graphql`,
		keepAlive: 10_000,
		retryAttempts: 10,
		connectionParams: async () => getAccessToken(),
	})
);

/* -------------------------------------------------------------------------- */
/*                               Error Link                                   */
/* -------------------------------------------------------------------------- */

const errorLink = new ErrorLink(({ graphQLErrors, networkError }: any) => {
	if (graphQLErrors) {
		for (const { message, locations, path } of graphQLErrors) {
			console.error(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
			);
		}
	}

	if (networkError) {
		console.error('[Network error]:', networkError);
	}
});

/* -------------------------------------------------------------------------- */
/*                                Auth Link                                   */
/* -------------------------------------------------------------------------- */

const authLink = new SetContextLink(async (prevContext) => {
	const tokenHeaders = await getAccessToken();
	return {
		headers: {
			...prevContext.headers,
			...tokenHeaders,
		},
	};
});

/* -------------------------------------------------------------------------- */
/*                             Split Link (WS)                                 */
/* -------------------------------------------------------------------------- */

const splitLink = ApolloLink.split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		);
	},
	wsLink,
	httpLink
);

/* -------------------------------------------------------------------------- */
/*                              Apollo Client                                 */
/* -------------------------------------------------------------------------- */

export const apolloClient = new ApolloClient({
	queryDeduplication: false,
	link: ApolloLink.from([errorLink, authLink, splitLink]),
	cache: new InMemoryCache(),
	devtools: {
		enabled: isDev ? true : false,
	},
});
