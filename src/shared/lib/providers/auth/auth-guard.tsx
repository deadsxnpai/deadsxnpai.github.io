import { useAuth } from '@/shared/lib/providers/auth/use-auth';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

// Auth Guard Component
export function AuthGuard({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size='large' />
			</View>
		);
	}

	if (!user) {
		return <Redirect href='/(auth)/login' />;
	}

	return <>{children}</>;
}
