Cloudflare Worker proxy for Moxfield & Manabox

This worker proxies two routes to upstream servers and sets CORS headers so your client (GitHub Pages hosted site) can fetch data without browser CORS errors.

Routes

-   `/api/moxfield/*` -> `https://api2.moxfield.com/*`
-   `/api/manabox/*` -> `https://manabox.app/*`

How it works

-   The worker forwards GET requests to the upstream host, injects a common `User-Agent` and `Accept` header, and returns the response.
-   Responses are cached at the edge for `CACHE_TTL_SECONDS` (default 300s) to reduce upstream load.
-   Worker sets `Access-Control-Allow-Origin` header (see ALLOWED_ORIGIN below).

Setup & deploy (quick)

1. Install Wrangler (Cloudflare CLI):
    ```bash
    npm install -g wrangler
    # or as a dev dependency in your project
    # npm install --save-dev wrangler
    ```
2. Replace `account_id` in `workers/wrangler.toml` with your Cloudflare account id.
3. Edit `workers/worker.js` and ensure `ALLOWED_ORIGIN` matches your GitHub Pages origin (the worker in this repo is preconfigured for `https://xdainz.github.io`).

4. (Optional) Configure your frontend to call the worker URL in production via Vite env var:
    - Create a `.env.production` file with:
        ```bash
        VITE_WORKER_BASE=https://<your-worker-subdomain>.workers.dev
        ```
    - In production `useDeckFetcher` will use `VITE_WORKER_BASE` if set; otherwise it falls back to calling upstream hosts directly.
5. Publish the worker:
    ```bash
    # from repo root
    wrangler publish workers/worker.js --name manacheck-proxy
    ```
    Or use `wrangler.toml` with `wrangler publish` per Wrangler docs.

Usage from your frontend

-   In production, point your client at the worker endpoint. Examples:
    -   `https://<your-worker-subdomain>.workers.dev/api/moxfield/v3/decks/all/<deckId>`
    -   `https://<your-worker-subdomain>.workers.dev/api/manabox/decks/<path>`

Notes & security

-   By default `ALLOWED_ORIGIN` is `*` in the worker; change it to your GH Pages origin before deploying.
-   This proxy can be abused if you expose it as an open proxy. You should validate / restrict allowed paths or add rate-limiting if you expect public traffic.
-   Use caching to avoid hitting upstream rate-limits; you may increase TTL for popular decks.

Optional: use Wrangler environment variables or secrets to provide a stricter allowed origin or credentials. See Cloudflare Workers docs.
