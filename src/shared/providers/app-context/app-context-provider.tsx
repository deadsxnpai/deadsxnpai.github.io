// app/providers/app-context/simplified-provider.tsx
import { createContext, useCallback, useContext, useState } from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';

interface AppContextType {
	showToast: (
		message: string,
		type?: 'info' | 'success' | 'warning' | 'error',
	) => void;
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
	userData: any;
	setUserData: (data: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useAppContext must be used within AppContextProvider');
	}
	return context;
};

export const AppContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [userData, setUserData] = useState(null);

	const showToast = useCallback(
		(
			message: string,
			type: 'info' | 'success' | 'warning' | 'error' = 'info',
		) => {
			if (Platform.OS === 'android') {
				ToastAndroid.show(message, ToastAndroid.SHORT);
			} else {
				Alert.alert(type.charAt(0).toUpperCase() + type.slice(1), message, [
					{ text: 'OK' },
				]);
			}
		},
		[],
	);

	const value = {
		showToast,
		isLoading,
		setIsLoading,
		userData,
		setUserData,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
