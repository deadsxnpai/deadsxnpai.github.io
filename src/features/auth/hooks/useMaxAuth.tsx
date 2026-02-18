// features/max/hooks/useMaxAuth.ts
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Типы для MAX
interface MaxUser {
	id: number;
	first_name?: string;
	last_name?: string;
	username?: string;
	language_code?: string;
}

interface MaxInitData {
	user?: MaxUser;
	auth_date?: number;
	hash?: string;
}

interface MaxThemeParams {
	bg_color?: string;
	text_color?: string;
	button_color?: string;
	button_text_color?: string;
}

interface MaxMainButton {
	show: () => void;
	hide: () => void;
	setText: (text: string) => void;
	onClick: (callback: () => void) => void;
	offClick: (callback: () => void) => void;
	enable: () => void;
	disable: () => void;
}

interface MaxBackButton {
	show: () => void;
	hide: () => void;
	onClick: (callback: () => void) => void;
	offClick: (callback: () => void) => void;
}

interface MaxWebApp {
	ready: () => void;
	expand: () => void;
	close: () => void;
	sendData: (data: string) => void;
	MainButton: MaxMainButton;
	BackButton: MaxBackButton;
	initData: string;
	initDataUnsafe: MaxInitData;
	themeParams: MaxThemeParams;
	onEvent: (event: string, callback: () => void) => void;
	offEvent: (event: string, callback: () => void) => void;
}

// Расширяем глобальный объект Window
declare global {
	interface Window {
		WebApp?: MaxWebApp;
	}
}

export const useMaxAuth = () => {
	const [maxInitialized, setMaxInitialized] = useState(false);
	const [maxUser, setMaxUser] = useState<MaxUser | null>(null);

	useEffect(() => {
		if (Platform.OS === 'web' && typeof window !== 'undefined') {
			loadMaxScript();
		}
	}, []);

	const loadMaxScript = () => {
		// Проверяем, есть ли уже WebApp
		if (window.WebApp) {
			handleMaxInit(window.WebApp);
			return;
		}

		// Подключаем скрипт
		const script = document.createElement('script');
		script.src = 'https://st.max.ru/js/max-web-app.js';
		script.async = true;

		script.onload = () => {
			console.log('MAX Bridge loaded');
			// Даем время на инициализацию
			setTimeout(() => {
				if (window.WebApp) {
					handleMaxInit(window.WebApp);
				}
			}, 100);
		};

		script.onerror = () => {
			console.error('Failed to load MAX Bridge');
		};

		document.head.appendChild(script);
	};

	const handleMaxInit = (webApp: MaxWebApp) => {
		setMaxInitialized(true);

		// Получаем данные пользователя
		const user = webApp.initDataUnsafe?.user;
		if (user) {
			setMaxUser(user);
		}

		// Применяем тему
		if (webApp.themeParams) {
			applyMaxTheme(webApp.themeParams);
		}

		// Сообщаем о готовности
		webApp.ready();

		console.log('MAX initialized:', user);
	};

	const applyMaxTheme = (theme: MaxThemeParams) => {
		if (theme.bg_color) {
			document.documentElement.style.setProperty(
				'--max-bg-color',
				theme.bg_color,
			);
		}
		if (theme.text_color) {
			document.documentElement.style.setProperty(
				'--max-text-color',
				theme.text_color,
			);
		}
	};

	return {
		maxInitialized,
		maxUser,
		isMaxEnvironment: Platform.OS === 'web' && !!window.WebApp,
	};
};
