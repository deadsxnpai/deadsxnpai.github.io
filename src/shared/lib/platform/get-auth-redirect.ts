import { Platform } from 'react-native';
export const MAIN_URL: string = 'http://localhost:8081/';

export const getAuthRedirect = () => {
	if (Platform.OS === 'web') {
		return MAIN_URL;
	}

	return 'tsumobile://app/';
};
