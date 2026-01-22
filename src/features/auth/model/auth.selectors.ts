import { useAuthStore } from './auth.store';

export const useAuth = () => ({
	user: useAuthStore((s) => s.user),
	isAuth: useAuthStore((s) => s.isAuth),
	groups: useAuthStore((s) => s.groups),
	loading: useAuthStore((s) => s.loading),
});

export const useHasGroup = (group: string) =>
	useAuthStore((s) => s.groups.includes(group));
