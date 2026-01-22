import { useEffect } from 'react';
import { useAuthStore } from '../model/auth.store';

export const TelegramLogin = () => {
	const checkAuth = useAuthStore((s) => s.checkAuth);

	useEffect(() => {
		const tg = (window as any).Telegram?.WebApp;

		if (!tg) return;

		tg.ready();
		tg.expand();
		checkAuth(); // проверяем initData и сохраняем user
	}, []);

	return <div>Логин через Telegram...</div>;
};
