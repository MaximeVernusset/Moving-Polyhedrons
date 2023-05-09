import './global.css';

import App from './App.svelte';

const app = new App({
	target: document.getElementById('canvas')
});

export default app;

const registerServiceWorker = async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('serviceWorker.js', {
                scope: './',
            });
        } catch (error) {
            console.error(`Service Worker registration failed: ${error}`);
        }
    }
};

registerServiceWorker();