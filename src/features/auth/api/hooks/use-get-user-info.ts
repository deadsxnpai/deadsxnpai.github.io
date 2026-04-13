import { useQuery } from '@apollo/client';
import { ME } from '../graphql/api.me';

export const useMe = () => {
	const { data, loading, error } = useQuery(ME, {
		fetchPolicy: 'network-only',
	});

	return {
		data: data?.me,
		loading,
		error,
	};
};
