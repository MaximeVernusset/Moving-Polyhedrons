/* eslint-disable no-undef */
(async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('serviceWorker.js');
        } catch (error) {
            console.error(`Service Worker registration failed: ${error}`);
        }
    }
})();
