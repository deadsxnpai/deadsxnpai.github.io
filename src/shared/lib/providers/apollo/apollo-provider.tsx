import { apolloClient } from '@/shared/api/client';
import { ApolloProvider as ApolloProviderLib } from '@apollo/client';

export const ApolloProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<ApolloProviderLib client={apolloClient}>{children}</ApolloProviderLib>
	);
};
