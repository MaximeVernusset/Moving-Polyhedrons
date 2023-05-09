/* eslint-disable no-undef */
const CACHE_FIRST_NAME = 'cacheFirst';
const CACHE_FALLACK_NAME = 'cache';
const CACHE_FIRST_RESOURCES = [
    '/',
    '/index.html',
    '/serviceWorkerRegistration.js',
    '/img/icon.png',
    '/build/bundle.js',
    '/build/bundle.css'
];
const FETCH_ERROR_STATUS_CODE = 499;

function isCacheFirstResource(request) {
    return CACHE_FIRST_RESOURCES.includes(
        `/${request.url.split(request.referrer)[1]}`
    );
}

async function addResourcesToCache(resources) {
    const cache = await caches.open(CACHE_FIRST_NAME);
    await cache.addAll(resources);
}

async function getFromCache(request, cacheName) {
    if (cacheName) {
        const namedCache = await caches.open(cacheName);
        return await namedCache.match(request);
    }
    return await caches.match(request);
}

async function getFromNetwork(request) {
    try {
        return await fetch(request);
    } catch (error) {
        return new Response(`An error ocurred when fetching ${request.url}`, {
            status: FETCH_ERROR_STATUS_CODE
        });
    }
}

async function putInCache(request, response, cacheName) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
}

async function cacheStrategy(request) {
    const isCacheFirst = isCacheFirstResource(request);

    if (isCacheFirst) {
        const responseFromCacheFirst = await getFromCache(request, CACHE_FIRST_NAME);
        if (responseFromCacheFirst) {
            return responseFromCacheFirst; 
        }
    }

    const responseFromNetwork = await getFromNetwork(request);
    if (responseFromNetwork.ok) {
        const cacheNameToUse = isCacheFirst ? CACHE_FIRST_NAME : CACHE_FALLACK_NAME;
        putInCache(request, responseFromNetwork.clone(), cacheNameToUse);
        return responseFromNetwork;
    } 

    const responseFromFallbackCache = await getFromCache(request, CACHE_FALLACK_NAME);
    if (responseFromFallbackCache) {
        return responseFromFallbackCache; 
    }

    return responseFromNetwork;
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        addResourcesToCache(CACHE_FIRST_RESOURCES.map(resource => `.${resource}`))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(cacheStrategy(event.request));
});