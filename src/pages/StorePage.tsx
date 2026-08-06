import { useParams } from "react-router-dom";
import { storeList } from "../constants";
import NotFound from "./NotFound";
import StoreCardBoxGrid from "../components/StoreCardBoxGrid";
import StoreAdvancedSearch from "../components/StoreAdvancedSearch";
import Pagination from "../components/Pagination";
import type { Card } from "../types/types";
import { fetchSheetCsv, type SheetRow } from "../lib/sheets";
import { fetchDeckCards } from "../lib/deckFetch";
import useTranslation from "../hooks/useTranslation";
import useStoreSearch from "../hooks/useStoreSearch";
import { useCallback, useEffect, useMemo, useState } from "react";
import StoreSearchDeck from "../components/StoreSearchDeck";

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

function StorePage() {
    const { name } = useParams();

    const store = storeList.find(
        (item) => item.name.toLocaleLowerCase() === name?.toLocaleLowerCase(),
    );

    const { t } = useTranslation();

    // The full, unfiltered store inventory as loaded from the sheet/cache.
    // This must stay untouched by StoreSearchDeck — it's the search space
    // every deck search runs against.
    const [storeCards, setStoreCards] = useState<Card[]>([]);
    // The subset of storeCards that match the user's most recent pasted
    // decklist, kept separate so re-running a search always matches against
    // the full storeCards list rather than a previously-filtered subset.
    const [deckMatchCards, setDeckMatchCards] = useState<Card[] | null>(null);
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

    const applyStoreCards = useCallback((nextCards: Card[]) => {
        setStoreCards(nextCards);
    }, []);

    const loadStoreDecks = useCallback(
        async (forceRefresh = false) => {
            if (!store) {
                setStoreError(t("store.notFound"));
                applyStoreCards([]);
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
                    applyStoreCards(cachedCards);
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
                applyStoreCards(merged);
                const timestamp = Date.now();
                setStoreCache(cacheKey, { timestamp, decks });
                setLastUpdated(timestamp);
                return merged;
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : String(e);
                setStoreError(message);
                applyStoreCards([]);
                return [];
            } finally {
                setStoreLoading(false);
            }
        },
        [applyStoreCards, store, t],
    );

    // Show the deck-matched subset when a search has been run, otherwise
    // fall back to the full store inventory.
    const displayedStoreCards = deckMatchCards ?? storeCards;

    const {
        filters,
        setFilters,
        filteredCards,
        paginatedCards,
        page,
        totalPages,
        setPage,
        availableSets,
        availableRarities,
        priceBounds,
        resetFilters,
    } = useStoreSearch(displayedStoreCards);

    const lastUpdatedLabel = useMemo(() => {
        const value = lastUpdated ?? cachedTimestamp;
        if (!value) return t("store.never");
        return new Date(value).toLocaleString();
    }, [lastUpdated, cachedTimestamp, t]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void loadStoreDecks();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [loadStoreDecks]);

    useEffect(() => {
        if (!store) return;

        const intervalId = window.setInterval(() => {
            if (storeLoading) return;

            const cacheKey = `manacheck.store.${store.gSheetId}.decks`;

            const cached = getStoreCache(cacheKey);

            const cacheExpired =
                !cached || Date.now() - cached.timestamp >= STORE_CACHE_TTL_MS;

            if (cacheExpired) {
                void loadStoreDecks(true);
            }
        }, 60_000);

        return () => window.clearInterval(intervalId);
    }, [loadStoreDecks, store, storeLoading]);

    if (!store) {
        return <NotFound />;
    }

    return (
        <div className="container store-page">
            {storeError ? "error" : null}
            <div className="box store-banner" id="store-banner">
                <img
                    className="store-logo"
                    src={store.image_banner}
                    alt={store.full_name + " logo"}
                />
                <div>
                    <h1>
                        {store.website ? (
                            <a
                                className="store-website"
                                href={store.website}
                                target="_blank"
                            >
                                {store.full_name}↗
                            </a>
                        ) : (
                            store.full_name
                        )}
                    </h1>
                    <h5 className="store-ck">CK ${store.ck_price}</h5>
                </div>
                {storeLoading && (
                    <div className="modal-backdrop" aria-live="polite">
                        <div
                            className="modal-card"
                            role="status"
                            aria-busy="true"
                        >
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
                <div className="store-banner-search">
                    <StoreSearchDeck
                        storeDeckList={storeCards}
                        onChangeValue={setDeckMatchCards}
                    />
                </div>
            </div>
            {displayedStoreCards.length > 0 ? (
                <div className="store-results-layout pt-3">
                    <StoreAdvancedSearch
                        filters={filters}
                        onChange={setFilters}
                        onReset={resetFilters}
                        availableSets={availableSets}
                        availableRarities={availableRarities}
                        priceBounds={priceBounds}
                        resultCount={filteredCards.length}
                        totalCount={displayedStoreCards.length}
                    />
                    <div className="store-results-main">
                        <StoreCardBoxGrid cardList={paginatedCards} />
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            ) : (
                <>
                    <StoreCardBoxGrid cardList={paginatedCards} />
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}
            <div className="store-deck-comparator store-helper mt-3">
                <p>
                    {t("store.helper")}{" "}
                    <button
                        type="button"
                        className="refetch-button"
                        onClick={() => loadStoreDecks(true)}
                        disabled={storeLoading}
                    >
                        {t("store.helperHere")}
                    </button>{" "}
                    {t("store.lastUpdated", { date: lastUpdatedLabel })}
                </p>
            </div>
        </div>
    );
}

export default StorePage;
