import * as Linking from 'expo-linking';

const APP_ENV: string = 'dev';
const DOMAIN: string = 'lk-dev.tsutmb.ru';
const protocol = APP_ENV === 'local' ? 'http' : 'https';
const BASE_URL = `${protocol}://${DOMAIN}/api`;
const redirectBase = Linking.createURL('');
const dev = 'lk-dev.tsutmb.ru';

export const isDev = DOMAIN === dev;

export const EndPoints = {
	domain: DOMAIN,
	api: BASE_URL,
	wss: `${protocol === 'https' ? 'wss' : 'ws'}://${DOMAIN}/api`,
	avatar: `${BASE_URL}/files/avatar`,
	upload: `${BASE_URL}/files/commonStorage`,
	download: `${BASE_URL}/files/uploads`,
	recordbook: `${BASE_URL}/files/recordbooks`,
	reference: `${BASE_URL}/files/references`,
	spy: `${BASE_URL}/spy/set`,
	userpic: `${BASE_URL}/files/userpic`,
	auth: `${BASE_URL}/auth?redirect=${encodeURIComponent(`/auth/telegram`)}`,
	endSession: `${BASE_URL}/endSession?redirect=${encodeURIComponent(
		`${redirectBase}login`,
	)}`,
	vkmail: `https://biz.mail.ru/login/tsutmb.ru`,
	vkcloud: `https://cloud.mail.ru`,
	chatbot: `https://jivo.chat/OMAS4HokqF`,
	chatbotStudent: `https://jivo.chat/QoInfbNA9f`,
};

export const getAuthUrl = (options?: { initData?: string }) => {
	if (options?.initData) {
		return `${BASE_URL}/auth?redirect=${encodeURIComponent(`https://t.me/deadsxnpai_claw_bot/tsuapp`)}&tgInitData=${encodeURIComponent(
			options.initData,
		)}`;
	}

	return `${BASE_URL}/auth?redirect=${encodeURIComponent(
		`${redirectBase}callback`,
	)}`;
};
