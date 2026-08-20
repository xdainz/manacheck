Cloudflare Worker proxy for Moxfield & Manabox & Archidekt

-   `/api/moxfield/*` -> `https://api2.moxfield.com/*`
-   `/api/manabox/*` -> `https://manabox.app/*`
-   `/api/archidekt/*` -> `https://archidekt.com/*`

Setup & deploy (quick)

1. Login to Cloudflare:

    ```bash
    wrangler login

    ```

2. Publish the worker:
    ```bash
    # from repo root
    wrangler deploy workers/worker.js --name manacheck-proxy
    ```
