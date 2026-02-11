import { gql, useQuery } from '@apollo/client';

const ME = gql(`
  query getME {
    me 
  }
`);

export const useMe = () => {
	const res = useQuery(ME, {
		fetchPolicy: 'network-only',
	});
	const { data, loading, error } = res;
	return {
		data,
		loading,
		error,
	};
};
