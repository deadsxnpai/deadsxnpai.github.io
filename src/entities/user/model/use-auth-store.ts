import { EndPoints } from "@/shared/constants";
import { Platform } from "react-native";
import { create } from "zustand";
import { AuthMeResponse } from "./types";
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { UserRoles } from "@/shared/constants/roles";

interface AuthState {
    user: AuthMeResponse | null;
    isLoading: boolean;
    setUser: (user: AuthMeResponse | null) => void;
    setLoading: (loading: boolean) => void;
    logout: (client: any) => Promise<void>;
    getRole: () => 'employee' | 'student' | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isLoading: true,

    setUser: (user) => set({ user }),
    setLoading: (isLoading) => set({ isLoading }),
    getRole: () => {
        const user = get().user;
        if (!user) return null;
        return user.groups.includes(UserRoles.WORKER) ||
            user.groups.includes(UserRoles.TESTER) ||
            user.groups.includes(UserRoles.EMPLOYEE)
            ? 'employee'
            : 'student';
    },

    logout: async (client) => {
        set({ user: null });

        if (Platform.OS === 'web') {
            localStorage.removeItem('access_token');
            window.location.assign(EndPoints.endSession);
        } else {
            await SecureStore.deleteItemAsync('access_token');
            await WebBrowser.openAuthSessionAsync(EndPoints.endSession);
        }

        await client.clearStore();
    },
}));