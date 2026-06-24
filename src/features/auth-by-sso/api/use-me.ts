import { gql, useQuery } from '@apollo/client';

export const ME = gql(`
  query getME {
    me 
  }
`);


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
