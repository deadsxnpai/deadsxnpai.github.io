export const closeTelegramWebApp = () => {
	if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
		(window as any).Telegram.WebApp.close();
	}
};
