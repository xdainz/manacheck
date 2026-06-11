import type { Card } from "../types/types";
import { parseManabox, parseMoxfield } from "./parsers";

export type DeckSource = "manabox" | "moxfield";

export type DeckFetchOptions = {
    // Base URL of the deployed Cloudflare Worker proxy ("" = fetch directly).
    workerBase: string;
    // In dev the Vite proxy (vite.config.ts) handles CORS instead.
    isDev: boolean;
};

function defaultOptions(): DeckFetchOptions {
    return {
        workerBase: import.meta.env?.VITE_WORKER_BASE ?? "",
        isDev: Boolean(import.meta.env.DEV),
    };
}

export function resolveFetchUrl(
    link: string,
    options: DeckFetchOptions,
): { url: string; source: DeckSource } {
    const { workerBase, isDev } = options;

    if (link.startsWith("https://manabox.app/")) {
        const path = link.replace("https://manabox.app", "");
        if (isDev) return { url: `/api/manabox${path}`, source: "manabox" };
        return {
            url: workerBase ? `${workerBase}/api/manabox${path}` : link,
            source: "manabox",
        };
    }

    if (link.startsWith("https://moxfield.com/decks/")) {
        const deckId = link.replace("https://moxfield.com/decks/", "");
        const apiPath = `/v3/decks/all/${deckId}`;
        if (isDev) return { url: `/api/moxfield${apiPath}`, source: "moxfield" };
        return {
            url: workerBase
                ? `${workerBase}/api/moxfield${apiPath}`
                : `https://api2.moxfield.com${apiPath}`,
            source: "moxfield",
        };
    }

    throw new Error("Unsupported domain");
}

export async function fetchDeckCards(
    link: string,
    options: DeckFetchOptions = defaultOptions(),
): Promise<Card[]> {
    const { url, source } = resolveFetchUrl(link, options);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch error ${res.status} for ${url}`);

    if (source === "manabox") {
        return parseManabox(await res.text());
    }
    return parseMoxfield(await res.json());
}
