import { STUDENT_INFO } from '@/features/profile/api/graphql/api.student-info';
import { useQuery } from '@apollo/client';

export const useStudentInfo = () => {
	const { data, loading, error, refetch } = useQuery(STUDENT_INFO, {
		fetchPolicy: 'network-only',
	});

	return {
		data: data?.studentInfo,
		loading,
		error,
		refetch,
	};
};
