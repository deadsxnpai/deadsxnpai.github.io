// lib/config/endpoints.ts
export const DOMAIN = process.env.REACT_APP_URL;
import { detectPlatform } from '@/shared/lib/platform/get-platform';

export const DOMAIN_API = 'lk-dev.tsutmb.ru/api';
export const BASE_URL_API = `https://${DOMAIN_API}`;

export const BASE_URL = `https://${DOMAIN}`;

export const dev = 'lk-dev.tsutmb.ru/api';
export const isDev = DOMAIN_API === dev;

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
		`${BASE_URL_API}/auth?redirect=${encodeURIComponent(getAuthRedirect())}`,
	endSession: () =>
		`${BASE_URL_API}/endSession?redirect=${encodeURIComponent(getLogoutRedirect())}`,
	avatar: `${BASE_URL_API}/files/avatar`,
	recordbook: `${BASE_URL_API}/files/recordbooks`,
	userpic: `${BASE_URL_API}/files/userpic`,
	vkmail: `https://biz.mail.ru/login/tsutmb.ru`,
	vkcloud: `https://cloud.mail.ru`,
	chatbot: `https://jivo.chat/OMAS4HokqF`,
	chatbotStudent: `https://jivo.chat/QoInfbNA9f`,
	moodle: `${BASE_URL_API}/moodle`,
} as const;
