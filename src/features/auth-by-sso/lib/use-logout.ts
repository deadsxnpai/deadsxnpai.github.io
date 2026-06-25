import { useAuthStore } from "@/entities/user";
import { apolloClient } from "@/shared/api";

export const useLogout = () => {
    const logoutStore = useAuthStore((state) => state.logout);
    return () => logoutStore(apolloClient);
};