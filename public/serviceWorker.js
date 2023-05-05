const CACHE = 'cache';

const addResourcesToCache = async (resources) => {
    const cache = await caches.open(CACHE);
    await cache.addAll(resources);
};

self.addEventListener('install', (event) => {
    event.waitUntil(
        addResourcesToCache([
            '/',
            '/index.html',
            '/img/icon.png',
            '/build/bundle.js',
            '/build/bundle.css'
        ])
    );
});

const putInCache = async (request, response) => {
    const cache = await caches.open(CACHE);
    await cache.put(request, response);
};

const cacheFirst = async (request) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
};

self.addEventListener('fetch', (event) => {
    event.respondWith(cacheFirst(event.request));
});