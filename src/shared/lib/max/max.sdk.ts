
export interface MaxWebApp {
    initData?: string;
    initDataUnsafe?: any;
    ready: () => void;
    expand: () => void;
    close: () => void;
    platform?: string;
    version?: string;
    sendData?: (data: any) => void;
}

declare global {
    interface Window {
        MaxWebApp?: MaxWebApp;
    }
}

export const loadMaxSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            resolve();
            return;
        }

        // Already loaded
        if (window.MaxWebApp) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://st.max.ru/js/max-web-app.js';
        script.async = true;
        script.onload = () => {
            console.log('Max SDK loaded');
            resolve();
        };
        script.onerror = () => {
            console.error('Failed to load Max SDK');
            reject(new Error('Failed to load Max SDK'));
        };
        document.head.appendChild(script);
    });
};

export const initMaxWebApp = async (): Promise<boolean> => {
    try {
        await loadMaxSDK();

        await new Promise((resolve) => setTimeout(resolve, 100));

        if (window.MaxWebApp) {
            window.MaxWebApp.ready();
            window.MaxWebApp.expand();
            console.log(
                'Max WebApp initialized, initData:',
                !!window.MaxWebApp.initData,
            );
            return true;
        }

        console.warn('MaxWebApp not available after loading');
        return false;
    } catch (error) {
        console.error('Failed to init Max WebApp:', error);
        return false;
    }
};

export const getMaxInitData = (): string | null => {
    if (typeof window === 'undefined') return null;

    if (window.MaxWebApp?.initData) {
        console.log('Got initData from Max SDK');
        return window.MaxWebApp.initData;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const urlData = urlParams.get('x-max-init-data');
    if (urlData) {
        console.log('Got initData from URL params');
        return urlData;
    }

    const stored = localStorage.getItem('x-max-init-data');
    if (stored) {
        console.log('Got initData from storage');
        return stored;
    }

    return null;
};

export const isMaxEnvironment = (): boolean => {
    if (typeof window === 'undefined') return false;

    if (window.MaxWebApp?.initData) {
        return !!window.MaxWebApp.initData;
    }

    return false;
};
