
export interface MaxWebApp {
    initData?: string;
    ready: () => void;
    expand: () => void;
}

export interface TelegramWebApp {
    initData: string;
    ready: () => void;
    expand: () => void;
}


// Загрузка любого внешнего скрипта
const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
    });
};

export const initWebApps = async () => {
    if (typeof window === 'undefined') return;

    // Инициализация Telegram
    try {
        await loadScript('https://telegram.org/js/telegram-web-app.js');
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
            window.dispatchEvent(new Event('tg-ready'));
            console.log('Telegram WebApp initialized');
        }
    } catch (e) { console.error('Telegram init failed', e); }

    // Инициализация Max
    try {
        await loadScript('https://st.max.ru/js/max-web-app.js');
        if (window.MaxWebApp) {
            window.MaxWebApp.ready();
            window.MaxWebApp.expand();
            console.log('Max WebApp initialized');
        }
    } catch (e) { console.error('Max init failed', e); }
};

export const getAuthData = (): string | null => {
    if (typeof window === 'undefined') return null;

    // Сначала ищем данные Telegram
    if (window.Telegram?.WebApp?.initData) return window.Telegram.WebApp.initData;

    // Затем Max
    if (window.MaxWebApp?.initData) return window.MaxWebApp.initData;

    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('x-init-data');
};

