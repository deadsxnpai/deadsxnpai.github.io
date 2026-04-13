import { useAuthStore } from './auth.store';

export const useAuth = () => useAuthStore((s) => s.isLogged);
export const useUser = () => useAuthStore((s) => s.user);
export const useGetRole = () => useAuthStore((s) => s.role);
