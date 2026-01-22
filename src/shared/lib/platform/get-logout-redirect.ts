import { Platform } from 'react-native';

export const MAIN_URL_LOGOUT: string = 'http://localhost:8081/';

export const getLogoutRedirect = () => {
	if (Platform.OS === 'web') {
		return MAIN_URL_LOGOUT;
	}

	return 'tsumobile://app/logout';
};
