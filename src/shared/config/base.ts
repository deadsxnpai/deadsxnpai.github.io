export const DOMAIN = 'lk.tsutmb.ru/api'; // prod
// export const DOMAIN = "lk-dev.tsutmb.ru/api"; // for tests

export const BASE_URL: string = `https://${DOMAIN}`;
export const AUTH_URL: string = `${BASE_URL}/auth?redirect=tsumobile://app/`;
export const END_SESSION_URL: string = `${BASE_URL}/endSession?redirect=tsumobile://app/logout`;

export const dev: string = 'lk-dev.tsutmb.ru/api';
export const isDev: boolean = DOMAIN === dev;

export const EndPoints = {
	auth: AUTH_URL,
	avatar: `${BASE_URL}/files/avatar`,
	recordbook: `${BASE_URL}/files/recordbooks`,
	userpic: `${BASE_URL}/files/userpic`,
	vkmail: `https://biz.mail.ru/login/tsutmb.ru`,
	vkcloud: `https://cloud.mail.ru`,
	chatbot: `https://jivo.chat/OMAS4HokqF`,
	chatbotStudent: `https://jivo.chat/QoInfbNA9f`,
	moodle: `${BASE_URL}/moodle`,
};
