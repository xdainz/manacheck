import { useCallback, useMemo, useState } from "react";
import { storeList } from "../constants";
import { getMatches } from "../hooks/compareDecks";
import type { ExportGroup } from "../hooks/compareDecks";
import { fetchSheetCsv } from "../hooks/fetchDeckList";
import useDeckFetcher from "../hooks/useDeckFetcher";
import type { Card } from "../types/types";
import CardBoxGrid from "./CardBoxGrid";
import SearchResult from "./SearchResult";

interface StoreSearchProps {
    storeName: string;
}

const STORE_CACHE_TTL_MS = 60 * 60 * 1000;

type CachedStoreDeck = {
    name: string;
    url: string;
    cards: Card[];
};

type CachedStorePayload = {
    timestamp: number;
    decks: CachedStoreDeck[];
};

function getStoreCache(key: string): CachedStorePayload | null {
    if (typeof window === "undefined" || !window.localStorage) return null;

    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as CachedStorePayload;
        if (
            !parsed ||
            typeof parsed.timestamp !== "number" ||
            !Array.isArray(parsed.decks)
        ) {
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}

function setStoreCache(key: string, payload: CachedStorePayload) {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
        window.localStorage.setItem(key, JSON.stringify(payload));
    } catch {
        // ignore storage errors
    }
}

function flattenDecks(decks: CachedStoreDeck[]): Card[] {
    const merged: Card[] = [];
    decks.forEach((deck) => {
        if (Array.isArray(deck.cards)) {
            merged.push(...deck.cards);
        }
    });
    return merged;
}

export default function StoreSearch({ storeName }: StoreSearchProps) {
    const store = storeList.find((item) => item.name === storeName);

    const {
        loading: searchLoading,
        error: searchError,
        cards: searchCards,
        fetchDeck: searchFetchDeck,
    } = useDeckFetcher();

    const { fetchDeck: storeFetchDeck } = useDeckFetcher();

    const [searchLink, setSearchLink] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [storeCards, setStoreCards] = useState<Card[]>([]);
    const [storeDecks, setStoreDecks] = useState<CachedStoreDeck[]>([]);
    const [storeLoading, setStoreLoading] = useState(false);
    const [storeError, setStoreError] = useState<string | null>(null);

    const loadStoreDecks = useCallback(async () => {
        if (!store) {
            setStoreError("Store not found.");
            setStoreCards([]);
            setStoreDecks([]);
            return [];
        }

        setStoreLoading(true);
        setStoreError(null);

        try {
            const cacheKey = `manacheck.store.${store.gSheetId}.decks`;
            const cached = getStoreCache(cacheKey);
            if (cached && Date.now() - cached.timestamp < STORE_CACHE_TTL_MS) {
                const cachedCards = flattenDecks(cached.decks);
                setStoreCards(cachedCards);
                setStoreDecks(cached.decks);
                return cachedCards;
            }

            const rows = await fetchSheetCsv(store.gSheetId);
            const decks: CachedStoreDeck[] = [];

            for (const row of rows) {
                const url = row.URL.trim();
                if (!url) continue;
                const cards = await storeFetchDeck(url);
                decks.push({
                    name: row.NAME ?? "",
                    url,
                    cards,
                });
            }

            const merged = flattenDecks(decks);
            setStoreCards(merged);
            setStoreDecks(decks);
            setStoreCache(cacheKey, { timestamp: Date.now(), decks });
            return merged;
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            setStoreError(message);
            setStoreCards([]);
            setStoreDecks([]);
            return [];
        } finally {
            setStoreLoading(false);
        }
    }, [store, storeFetchDeck]);

    const handleFetch = async (e: React.FormEvent) => {
        e.preventDefault();
        setHasSearched(true);

        try {
            await Promise.all([
                searchFetchDeck(searchLink.trim()),
                loadStoreDecks(),
            ]);
        } catch {
            // errors are handled inside useDeckFetcher
        }
    };

    const isLoading = searchLoading || storeLoading;
    const errorMessage = searchError || storeError;

    const matches = useMemo(() => {
        // keep UI empty while fetching
        if (isLoading) return [];
        if (!searchCards.length || !storeCards.length) return [];
        return getMatches(searchCards, storeCards);
    }, [isLoading, searchCards, storeCards]);

    const groupedMatches = useMemo((): ExportGroup[] => {
        if (isLoading) return [];
        if (!searchCards.length || !storeDecks.length) return [];

        const searchNameSet = new Set(searchCards.map((card) => card.Name));

        return storeDecks
            .map((deck) => {
                const cards = deck.cards.filter((card) =>
                    searchNameSet.has(card.Name),
                );
                if (cards.length === 0) return null;

                const trimmedName = deck.name.trim();
                const title = `[${trimmedName || "Unknown Deck"}]`;

                return { title, cards };
            })
            .filter((group): group is ExportGroup => Boolean(group));
    }, [isLoading, searchCards, storeDecks]);

    return (
        <div>
            <div className="box mx-auto deck-comparator">
                <h1>Search in {storeName}'s stock</h1>
                <form onSubmit={handleFetch} className="form-stack">
                    <div className="input-row">
                        <input
                            value={searchLink}
                            onChange={(e) => setSearchLink(e.target.value)}
                            placeholder="Paste here your manabox/moxfield link."
                            className="form-control"
                            required
                            aria-label="Deck link"
                        />
                        <button
                            type="button"
                            className="input-clear"
                            onClick={() => setSearchLink("")}
                            disabled={!searchLink || isLoading}
                            aria-label="Clear deck link"
                        >
                            Clear
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="button submit-button"
                        disabled={isLoading}
                    >
                        Search
                    </button>
                </form>
                {errorMessage && (
                    <div style={{ color: "crimson" }}>
                        Error: {errorMessage}
                    </div>
                )}
            </div>
            {hasSearched && (
                <div>
                    {isLoading ? (
                        <>
                            <div
                                className="box mt-3 mb-3 deck-comparator skeleton-result"
                                role="status"
                                aria-live="polite"
                                aria-busy="true"
                            >
                                <div className="skeleton-block skeleton-line skeleton-title" />
                                <div className="skeleton-row">
                                    <div className="skeleton-block skeleton-line skeleton-sm" />
                                    <div className="skeleton-block skeleton-line skeleton-md" />
                                </div>
                                <div className="skeleton-block skeleton-line skeleton-price" />
                            </div>
                            <CardBoxGrid cardList={[]} loading />
                        </>
                    ) : (
                        <>
                            {matches.length > 0 && (
                                <SearchResult
                                    margin_top="3"
                                    list={matches}
                                    groups={groupedMatches}
                                />
                            )}
                            <CardBoxGrid cardList={matches} />
                            {matches.length > 0 && (
                                <SearchResult
                                    margin_top="2"
                                    list={matches}
                                    groups={groupedMatches}
                                />
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
