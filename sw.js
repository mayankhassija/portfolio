const CACHE_NAME = 'music-cache-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // Only cache FLAC files
    if (url.endsWith('.flac')) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const cachedResponse = await cache.match(event.request);
                
                if (cachedResponse) {
                    // Handle Range Requests (Required for Safari/Chrome Audio)
                    return handleRangeRequest(event.request, cachedResponse);
                }

                return fetch(event.request).then((networkResponse) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
        );
    }
});

// Helper to allow seeking and partial playback from cache
async function handleRangeRequest(request, response) {
    const data = await response.arrayBuffer();
    const range = request.headers.get('range');
    if (!range) return new Response(data, { headers: response.headers });

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : data.byteLength - 1;

    return new Response(data.slice(start, end + 1), {
        status: 206,
        statusText: 'Partial Content',
        headers: {
            'Content-Range': `bytes ${start}-${end}/${data.byteLength}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': end - start + 1,
            'Content-Type': 'audio/flac'
        }
    });
}
