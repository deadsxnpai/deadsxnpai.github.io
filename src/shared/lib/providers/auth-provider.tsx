import { useEffect } from 'react';
import { useMe } from '@/features/auth-by-sso';
import { useAuthStore } from '@/entities/user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { data, loading, error } = useMe();

	const { setUser, setLoading } = useAuthStore();

	useEffect(() => {
		setLoading(loading);
		if (data) setUser(data);
		if (error) setUser(null);
	}, [data, loading, error]);

	return <>{children}</>;
};
