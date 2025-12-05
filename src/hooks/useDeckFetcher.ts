import { useCallback, useState } from "react";
import type { Card } from "../types/CardType";

async function fetchText(url: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch error ${res.status} for ${url}`);
    return res.text();
}

function unescapeHtmlEntities(s: string) {
    return s
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
}

export function parseManabox(htmlText: string): Card[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const islands = Array.from(doc.getElementsByTagName("astro-island"));
    if (islands.length < 2) return [];

    const props = islands[1].getAttribute("props") || "";
    const unescaped = unescapeHtmlEntities(props);

    let dataObj: any;
    try {
        dataObj = JSON.parse(unescaped);
    } catch (e) {
        throw new Error("Failed to parse manabox JSON props: " + String(e));
    }

    const raw_card_list = dataObj?.deck?.[1]?.cards?.[1];
    if (!Array.isArray(raw_card_list)) return [];

    return raw_card_list.map((card: any) => {
        const data = card[1];
        return {
            Name: data?.name?.[1] ?? "",
            Set: (data?.setId?.[1] ?? "").toString().toUpperCase(),
            "Collector Number": data?.collectorNumber?.[1] ?? "",
            Rarity: String(data?.rarity?.[1] ?? "").replace(/^./, (c) =>
                c.toUpperCase()
            ),
            Quantity: Number(data?.quantity?.[1] ?? 0),
        } as Card;
    });
}

export function parseMoxfield(dataObj: any): Card[] {
    const cleaned: Card[] = [];
    const categories = [
        "mainboard",
        "sideboard",
        "maybeboard",
        "commanders",
        "companions",
        "signatureSpells",
    ];
    const boards = dataObj?.boards;
    if (!boards) return [];

    categories.forEach((cat) => {
        const cardObj = boards[cat]?.cards;
        if (!cardObj) return;
        Object.values(cardObj).forEach((entry: any) => {
            const card = entry.card;
            const quantity = entry.quantity ?? 0;
            cleaned.push({
                Name: card?.name ?? "",
                Set: (card?.set ?? "").toString().toUpperCase(),
                "Collector Number": card?.cn ?? "",
                Rarity: String(card?.rarity ?? "").replace(/^./, (c) =>
                    c.toUpperCase()
                ),
                Quantity: Number(quantity),
            });
        });
    });

    return cleaned;
}

export default function useDeckFetcher() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    // Optional production worker base (set VITE_WORKER_BASE in .env.production)
    const WORKER_BASE =
        (import.meta.env && (import.meta.env as any).VITE_WORKER_BASE) || "";

    const fetchDeck = useCallback(async (link: string) => {
        setLoading(true);
        setError(null);
        try {
            if (link.startsWith("https://manabox.app/")) {
                // During development use the Vite proxy to avoid CORS issues.
                const path = link.replace("https://manabox.app", "");
                const devFetch = `/api/manabox${path}`;
                const prodFetch = WORKER_BASE
                    ? `${WORKER_BASE}/api/manabox${path}`
                    : link;
                const fetchUrl = import.meta.env.DEV ? devFetch : prodFetch;
                const text = await fetchText(fetchUrl);
                const parsed = parseManabox(text);
                setCards(parsed);
            } else if (link.startsWith("https://moxfield.com/decks/")) {
                // Convert public deck page URL to API path
                const deckId = link.replace("https://moxfield.com/decks/", "");

                const apiPath: string = `/v3/decks/all/${deckId}`;

                const prodUrl = `https://api2.moxfield.com${apiPath}`;
                const workerUrl = WORKER_BASE
                    ? `${WORKER_BASE}/api/moxfield${apiPath}`
                    : prodUrl;
                const api = import.meta.env.DEV
                    ? `/api/moxfield${apiPath}`
                    : workerUrl;

                const res = await fetch(api);
                if (!res.ok)
                    throw new Error(`Moxfield API error ${res.status}`);
                const json = await res.json();
                const parsed = parseMoxfield(json);
                setCards(parsed);
            } else {
                throw new Error("Unsupported domain");
            }
        } catch (e: any) {
            setError(e?.message ?? String(e));
            setCards([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, cards, fetchDeck };
}
