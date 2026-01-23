import { detectPlatform } from '@/shared/lib/platform/get-platform';
export const DOMAIN: string = 'lk-dev.tsutmb.ru';

export const BASE_URL = `https://${DOMAIN}/api`;

export const dev = 'lk-dev.tsutmb.ru/api';
export const isDev = BASE_URL === dev;

export const PLATFORM = detectPlatform();

export const getAuthRedirect = () => {
	if (PLATFORM === 'web') {
		if (typeof window !== 'undefined') {
			return window.location.hostname === 'localhost'
				? 'http://localhost:8081'
				: `https://${DOMAIN}`;
		}
		return `https://${DOMAIN}`;
	}

	return 'tsumobile://app';
};

export const getLogoutRedirect = () => {
	if (PLATFORM === 'web') {
		if (typeof window !== 'undefined') {
			return window.location.hostname === 'localhost'
				? 'http://localhost:8081/login'
				: `https://${DOMAIN}/login`;
		}
		return `https://${DOMAIN}/login`;
	}

	return 'tsumobile://app/logout';
};

export const EndPoints = {
	auth: () =>
		`${BASE_URL}/auth?redirect=${encodeURIComponent(getAuthRedirect())}`,
	endSession: () =>
		`${BASE_URL}/endSession?redirect=${encodeURIComponent(getLogoutRedirect())}`,
	avatar: `${BASE_URL}/files/avatar`,
	recordbook: `${BASE_URL}/files/recordbooks`,
	userpic: `${BASE_URL}/files/userpic`,
	vkmail: `https://biz.mail.ru/login/tsutmb.ru`,
	vkcloud: `https://cloud.mail.ru`,
	chatbot: `https://jivo.chat/OMAS4HokqF`,
	chatbotStudent: `https://jivo.chat/QoInfbNA9f`,
	moodle: `${BASE_URL}/moodle`,
} as const;
