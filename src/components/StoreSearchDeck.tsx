import { useEffect, useMemo, useRef, useState } from "react";
import useDeckFetcher from "../hooks/useDeckFetcher";
import type { Card } from "../types/types";
import { getMatches } from "../lib/matching";
import useTranslation from "../hooks/useTranslation";

interface StoreSearchDeckProps {
    storeDeckList: Card[];
    // null means "no active search — show the unfiltered store list",
    // distinct from an empty array which means "searched, zero matches".
    onChangeValue: (newList: Card[] | null) => void;
}

export default function StoreSearchDeck({
    storeDeckList,
    onChangeValue,
}: StoreSearchDeckProps) {
    const { t } = useTranslation();

    const {
        loading: searchLoading,
        error: searchError,
        cards: searchCards,
        fetchDeck: searchFetchDeck,
        reset: searchReset,
    } = useDeckFetcher();

    // storeDeckList is both an input here and the thing onChangeValue writes
    // back to in the parent (storeDeckList={storeCards}, onChangeValue=
    // {setDeckMatchCards}). useMemo returns a new array identity on every
    // recompute, so naively calling onChangeValue(matches) whenever `matches`
    // changes reference would create an update loop. Track the last reported
    // matches so we only report up when the results actually changed (or the
    // user explicitly clears the search).
    const lastReportedRef = useRef<Card[] | null>(null);

    const [searchLink, setSearchLink] = useState("");

    const handleFetch = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await Promise.all([searchFetchDeck(searchLink.trim())]);
        } catch {
            // errors are handled inside useDeckFetcher
        }
    };

    const handleClear = () => {
        setSearchLink("");
        searchReset();
        lastReportedRef.current = null;
        onChangeValue(null);
    };

    const matches = useMemo(() => {
        // keep UI empty while fetching
        if (searchLoading) return [];
        if (!searchCards.length || !storeDeckList.length) return [];

        return getMatches(searchCards, storeDeckList);
    }, [searchLoading, searchCards, storeDeckList]);

    useEffect(() => {
        if (!searchCards.length) return;

        const previous = lastReportedRef.current;
        const unchanged =
            previous !== null &&
            previous.length === matches.length &&
            previous.every((card, i) => card === matches[i]);

        if (unchanged) return;

        lastReportedRef.current = matches;
        onChangeValue(matches);
    }, [matches, searchCards, onChangeValue]);

    const hasActiveSearch =
        searchLink.length > 0 || searchCards.length > 0 || !!searchError;

    return (
        <div className="store-deck-search">
            <form onSubmit={handleFetch}>
                <input
                    value={searchLink}
                    onChange={(e) => setSearchLink(e.target.value)}
                    placeholder={t("store.searchInput")}
                    className="form-control deck-input"
                    required
                />
                <button
                    type="submit"
                    className="button mt-3 submit-button"
                    disabled={searchLoading}
                >
                    {t("store.submit")}
                </button>
                {hasActiveSearch && (
                    <button
                        type="button"
                        className="button mt-3 clear-button"
                        onClick={handleClear}
                        disabled={searchLoading}
                    >
                        {t("result.clear")}
                    </button>
                )}
            </form>
            {searchLoading && <div>Loading…</div>}
            {searchError && (
                <div style={{ color: "crimson" }}>Error: {searchError}</div>
            )}
        </div>
    );
}
