import { gql, useQuery } from '@apollo/client';

const ME = gql(`
  query getME {
    me 
  }
`);

export const useMe = () =>
	useQuery(ME, {
		fetchPolicy: 'network-only',
	});
