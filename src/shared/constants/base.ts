export const DOMAIN = 'lk.tsutmb.ru/api'; // prod
// export const DOMAIN = "lk-dev.tsutmb.ru/api"; // for tests

export const BASE_URL: string = `https://${DOMAIN}`;
export const AUTH_URL: string = `${BASE_URL}/auth?redirect=mytgumobilev1://app/authcheck`;
export const END_SESSION_URL: string = `${BASE_URL}/endSession?redirect=mytgumobilev1://app/logout`;

export const dev: string = 'lk-dev.tsutmb.ru/api';
export const isDev: boolean = DOMAIN === dev;

export const EndPoints = {
	avatar: `${BASE_URL}/files/avatar`,
	upload: `${BASE_URL}/files/commonStorage`,
	download: `${BASE_URL}/files/uploads`,
	recordbook: `${BASE_URL}/files/recordbooks`,
	reference: `${BASE_URL}/files/references`,
	spy: `${BASE_URL}/spy/set`,
	auth: AUTH_URL,
	images: `${BASE_URL}/files/images/`,
	mail: `${BASE_URL}/mail`,
	userpic: `${BASE_URL}/files/userpic`,
	vkmail: `https://biz.mail.ru/login/tsutmb.ru`,
	vkcloud: `https://cloud.mail.ru`,
	chatbot: `https://jivo.chat/OMAS4HokqF`,
	chatbotStudent: `https://jivo.chat/QoInfbNA9f`,
	moodle: `${BASE_URL}/moodle`,
};
