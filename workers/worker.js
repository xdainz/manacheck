// Cloudflare Worker: proxy for Moxfield and Manabox
// - Routes
//   /api/moxfield/* -> https://api2.moxfield.com/*
//   /api/manabox/*  -> https://manabox.app/*
// Edit ALLOWED_ORIGIN to restrict CORS to your GH Pages origin before publishing.

// Use the site origin (no path). GitHub Pages origin for your site:
const ALLOWED_ORIGIN = "https://xdainz.github.io";
const CACHE_TTL_SECONDS = 300; // 5 minutes

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
    const { request } = event;
    const url = new URL(request.url);

    // Preflight
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders() });
    }

    const pathname = url.pathname;
    let upstreamBase = null;
    let upstreamPath = null;

    if (pathname.startsWith("/api/moxfield")) {
        upstreamBase = "https://api2.moxfield.com";
        upstreamPath = pathname.replace(/^\/api\/moxfield/, "");
    } else if (pathname.startsWith("/api/manabox")) {
        upstreamBase = "https://manabox.app";
        upstreamPath = pathname.replace(/^\/api\/manabox/, "");
    } else {
        return new Response("Not found", {
            status: 404,
            headers: corsHeaders(),
        });
    }

    const upstreamUrl = upstreamBase + upstreamPath + url.search;

    // Only cache GET requests
    if (request.method !== "GET") {
        return fetchAndReturn(upstreamUrl, event);
    }

    const cache = caches.default;
    try {
        const cached = await cache.match(upstreamUrl);
        if (cached) return addCorsHeaders(cached);
    } catch (err) {
        // cache may fail in some environments; ignore and continue
    }

    const resp = await fetchAndReturn(upstreamUrl, event);

    // Put in cache if successful
    if (resp.ok) {
        try {
            const toCache = resp.clone();
            // set cache-control header so future consumers can respect TTL; also store at edge
            toCache.headers.set(
                "Cache-Control",
                `public, max-age=${CACHE_TTL_SECONDS}`
            );
            event.waitUntil(caches.default.put(upstreamUrl, toCache));
        } catch (e) {
            // ignore cache put errors
        }
    }

    return addCorsHeaders(resp);
}

async function fetchAndReturn(upstreamUrl, event) {
    const headers = {
        "User-Agent":
            "Mozilla/5.0 (compatible; manacheck/1.0; +https://github.com/xdainz/manacheck)",
        Accept: "application/json, text/html, */*",
    };

    const r = await fetch(upstreamUrl, { method: "GET", headers });

    // Clone and normalize headers we want to keep
    const respHeaders = new Headers();
    const contentType = r.headers.get("content-type");
    if (contentType) respHeaders.set("Content-Type", contentType);

    const arrayBuf = await r.arrayBuffer();
    return new Response(arrayBuf, { status: r.status, headers: respHeaders });
}

function addCorsHeaders(response) {
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    newHeaders.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    newHeaders.set("Access-Control-Allow-Headers", "Content-Type");
    return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
    });
}

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };
}
