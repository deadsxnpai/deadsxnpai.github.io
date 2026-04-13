import { getUserType } from '@/entities/user';
import { mapAuthMeToUser, useAuthActions, useMe } from '@/features/auth';
import { Loader } from '@/shared/ui';
import { ErrorView } from '@/widgets/error-view';
import { ReactNode, useEffect } from 'react';

const isUnauthorizedError = (error: any): boolean => {
	return (
		error?.graphQLErrors?.some(
			(err: any) =>
				err.extensions?.code === 'UNAUTHENTICATED' ||
				err.extensions?.statusCode === 401,
		) || error?.networkError?.statusCode === 401
	);
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const { data, loading, error } = useMe();
	const { setUser, setRole } = useAuthActions();

	useEffect(() => {
		if (data !== undefined) {
			const user = mapAuthMeToUser(data);
			setUser(user);
			const role = getUserType(user.groups);
			setRole(role);
		}
	}, [data, setUser, setRole]);

	if (loading) return <Loader />;
	if (error && !isUnauthorizedError(error)) return <ErrorView error={error} />;

	return <>{children}</>;
};
