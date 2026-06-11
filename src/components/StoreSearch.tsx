import { useCallback, useMemo, useState } from "react";
import { storeList } from "../constants";
import { fetchDeckCards } from "../lib/deckFetch";
import type { ExportGroup } from "../lib/export";
import { fetchSheetCsv } from "../lib/sheets";
import type { SheetRow } from "../lib/sheets";
import useDeckFetcher from "../hooks/useDeckFetcher";
import useMatches from "../hooks/useMatches";
import type { Card } from "../types/types";
import CardBoxGrid from "./CardBoxGrid";
import DeckLinkInput from "./DeckLinkInput";
import ResultSkeleton from "./ResultSkeleton";
import SearchResult from "./SearchResult";

interface StoreSearchProps {
    storeName: string;
}

const STORE_CACHE_TTL_MS = 60 * 60 * 1000;
const FETCH_CONCURRENCY = 4;

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
            // A trailing "*" on the decklist name marks special pricing.
            if (deck.name.trim().endsWith("*")) {
                merged.push(
                    ...deck.cards.map((card) => ({
                        ...card,
                        special_price: true,
                    })),
                );
            } else {
                merged.push(...deck.cards);
            }
        }
    });
    return merged;
}

// Fetch every deck with a small worker pool; a deck that fails to fetch or
// parse resolves as empty instead of failing the whole store load.
async function fetchStoreDecks(
    rows: SheetRow[],
    onProgress: (done: number) => void,
): Promise<CachedStoreDeck[]> {
    const decks: CachedStoreDeck[] = new Array(rows.length);
    let nextIndex = 0;
    let done = 0;

    async function workerLoop() {
        while (nextIndex < rows.length) {
            const index = nextIndex++;
            const row = rows[index];
            const url = row.URL.trim();
            let cards: Card[] = [];
            try {
                cards = await fetchDeckCards(url);
            } catch {
                // skip decks that fail; the rest of the store still loads
            }
            decks[index] = { name: row.NAME ?? "", url, cards };
            done++;
            onProgress(done);
        }
    }

    const poolSize = Math.min(FETCH_CONCURRENCY, rows.length);
    await Promise.all(Array.from({ length: poolSize }, workerLoop));
    return decks;
}

export default function StoreSearch({ storeName }: StoreSearchProps) {
    const store = storeList.find((item) => item.name === storeName);

    const {
        loading: searchLoading,
        error: searchError,
        cards: searchCards,
        fetchDeck: searchFetchDeck,
    } = useDeckFetcher();

    const [searchLink, setSearchLink] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [storeCards, setStoreCards] = useState<Card[]>([]);
    const [storeDecks, setStoreDecks] = useState<CachedStoreDeck[]>([]);
    const [storeLoading, setStoreLoading] = useState(false);
    const [storeError, setStoreError] = useState<string | null>(null);
    const [storeProgress, setStoreProgress] = useState({
        current: 0,
        total: 0,
    });
    const [lastUpdated, setLastUpdated] = useState<number | null>(null);

    const cachedTimestamp = useMemo(() => {
        if (!store) return null;
        const cacheKey = `manacheck.store.${store.gSheetId}.decks`;
        const cached = getStoreCache(cacheKey);
        return cached?.timestamp ?? null;
    }, [store]);

    const loadStoreDecks = useCallback(
        async (forceRefresh = false) => {
            if (!store) {
                setStoreError("Store not found.");
                setStoreCards([]);
                setStoreDecks([]);
                return [];
            }

            setStoreLoading(true);
            setStoreError(null);
            setStoreProgress({ current: 0, total: 0 });

            try {
                const cacheKey = `manacheck.store.${store.gSheetId}.decks`;
                const cached = getStoreCache(cacheKey);
                if (
                    cached &&
                    !forceRefresh &&
                    Date.now() - cached.timestamp < STORE_CACHE_TTL_MS
                ) {
                    const cachedCards = flattenDecks(cached.decks);
                    setStoreCards(cachedCards);
                    setStoreDecks(cached.decks);
                    setLastUpdated(cached.timestamp);
                    return cachedCards;
                }

                const rows = await fetchSheetCsv(store.gSheetId);
                const trimmedRows = rows.filter((row) => row.URL.trim());
                setStoreProgress({ current: 0, total: trimmedRows.length });

                const decks = await fetchStoreDecks(trimmedRows, (done) =>
                    setStoreProgress({
                        current: done,
                        total: trimmedRows.length,
                    }),
                );

                const merged = flattenDecks(decks);
                setStoreCards(merged);
                setStoreDecks(decks);
                const timestamp = Date.now();
                setStoreCache(cacheKey, { timestamp, decks });
                setLastUpdated(timestamp);
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
        },
        [store],
    );

    const handleFetch = async (e: React.FormEvent) => {
        e.preventDefault();
        setHasSearched(true);

        try {
            await Promise.all([
                searchFetchDeck(searchLink.trim()),
                loadStoreDecks(),
            ]);
        } catch {
            // errors are handled inside useDeckFetcher / loadStoreDecks
        }
    };

    const isLoading = searchLoading || storeLoading;
    const errorMessage = searchError || storeError;

    const matches = useMatches(isLoading, searchCards, storeCards);

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

    const lastUpdatedLabel = useMemo(() => {
        const value = lastUpdated ?? cachedTimestamp;
        if (!value) return "Never";
        return new Date(value).toLocaleString();
    }, [lastUpdated, cachedTimestamp]);

    return (
        <div>
            <div className="box mx-auto deck-comparator">
                <h1>Search in {storeName}'s stock</h1>
                <form onSubmit={handleFetch} className="form-stack">
                    <DeckLinkInput
                        value={searchLink}
                        onChange={setSearchLink}
                        placeholder="Paste here your manabox/moxfield link."
                        clearAriaLabel="Clear deck link"
                        inputAriaLabel="Deck link"
                        disabled={isLoading}
                    />
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
                        <ResultSkeleton />
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
            {storeLoading && (
                <div className="modal-backdrop" aria-live="polite">
                    <div className="modal-card" role="status" aria-busy="true">
                        <h2>Fetching decklists</h2>
                        <progress
                            className="progress-bar"
                            value={
                                storeProgress.total
                                    ? storeProgress.current
                                    : undefined
                            }
                            max={storeProgress.total || 1}
                        />
                        <p className="progress-text">
                            {storeProgress.total
                                ? `${storeProgress.current}/${storeProgress.total} decklists fetched`
                                : "Starting..."}
                        </p>
                    </div>
                </div>
            )}
            <div className="deck-comparator store-helper mt-3">
                <p>
                    Store data automatically updates every hour + whatever it
                    takes for Moxfield's API to update, if you want to update
                    manually click {""}
                    <button
                        type="button"
                        className="refetch-button"
                        onClick={() => loadStoreDecks(true)}
                        disabled={storeLoading}
                    >
                        here.
                    </button>
                    {""} (Last updated at: {lastUpdatedLabel})
                </p>
            </div>
        </div>
    );
}
