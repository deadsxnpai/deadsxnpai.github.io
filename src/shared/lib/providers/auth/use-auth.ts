// app/providers/auth/use-auth.ts
import { useContext } from 'react';
import { AuthContext } from './auth-context';

/**
 * Custom hook to access auth context
 * @returns AuthContextType with user, login, logout, etc.
 * @throws Error if used outside AuthProvider
 */
export const useAuth = () => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
};
