import { getAuthRedirect } from '@/shared/lib/platform/get-auth-redirect';
import { getLogoutRedirect } from '@/shared/lib/platform/get-logout-redirect';

// export const DOMAIN_API = 'lk.tsutmb.ru/api'; // prod
export const DOMAIN_API = 'lk-dev.tsutmb.ru/api'; // dev
export const BASE_URL_API: string = `https://${DOMAIN_API}`;

export const DOMAIN = 'lk.tsutmb.ru';
export const BASE_URL: string = `https://${DOMAIN}`;

export const AUTH_URL: string = `${BASE_URL_API}/auth?redirect=${encodeURIComponent(
	getAuthRedirect(),
)}`;

export const END_SESSION_URL: string = `${BASE_URL_API}/endSession?redirect=${encodeURIComponent(
	getLogoutRedirect(),
)}`;

export const dev: string = 'lk-dev.tsutmb.ru/api';
export const isDev: boolean = DOMAIN_API === dev;

export const EndPoints = {
	auth: AUTH_URL,
	avatar: `${BASE_URL_API}/files/avatar`,
	recordbook: `${BASE_URL_API}/files/recordbooks`,
	userpic: `${BASE_URL_API}/files/userpic`,
	vkmail: `https://biz.mail.ru/login/tsutmb.ru`,
	vkcloud: `https://cloud.mail.ru`,
	chatbot: `https://jivo.chat/OMAS4HokqF`,
	chatbotStudent: `https://jivo.chat/QoInfbNA9f`,
	moodle: `${BASE_URL_API}/moodle`,
} as const;
