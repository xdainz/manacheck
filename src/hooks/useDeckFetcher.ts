import { useCallback, useState } from "react";
import { fetchDeckCards } from "../lib/deckFetch";
import type { Card } from "../types/types";

export default function useDeckFetcher() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cards, setCards] = useState<Card[]>([]);

    const fetchDeck = useCallback(async (link: string): Promise<Card[]> => {
        setLoading(true);
        setError(null);
        try {
            const parsed = await fetchDeckCards(link);
            setCards(parsed);
            return parsed;
        } catch (e: unknown) {
            if (e instanceof Error) setError(e.message);
            else setError(`unknown error: ${e}`);

            setCards([]);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setCards([]);
    }, []);

    return { loading, error, cards, fetchDeck, reset };
}
