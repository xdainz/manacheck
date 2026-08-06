import { useEffect, useMemo, useState } from "react";
import useDeckFetcher from "../hooks/useDeckFetcher";
import type { Card } from "../types/types";
import { getMatches } from "../lib/matching";

interface StoreSearchDeckProps {
    storeDeckList: Card[];
    onChangeValue: (newList: Card[]) => void;
}

export default function StoreSearchDeck({
    storeDeckList,
    onChangeValue,
}: StoreSearchDeckProps) {
    const {
        loading: searchLoading,
        error: searchError,
        cards: searchCards,
        fetchDeck: searchFetchDeck,
    } = useDeckFetcher();

    const [searchLink, setSearchLink] = useState("");

    const handleFetch = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await Promise.all([searchFetchDeck(searchLink.trim())]);
        } catch {
            // errors are handled inside useDeckFetcher
        }
    };

    const matches = useMemo(() => {
        // keep UI empty while fetching
        if (searchLoading) return [];
        if (!searchCards.length || !storeDeckList.length) return [];

        return getMatches(searchCards, storeDeckList);
    }, [searchLoading, searchCards, storeDeckList]);

    useEffect(() => {
        onChangeValue(matches);
    }, [matches, onChangeValue]);

    return (
        <div className="store-deck-search">
            <form onSubmit={handleFetch}>
                <input
                    value={searchLink}
                    onChange={(e) => setSearchLink(e.target.value)}
                    placeholder="Paste here your manabox/moxfield link."
                    className="form-control deck-input"
                    required
                />
                <button
                    type="submit"
                    className="button mt-3 submit-button"
                    disabled={searchLoading}
                >
                    Search
                </button>
            </form>
            {searchLoading && <div>Loading…</div>}
            {searchError && (
                <div style={{ color: "crimson" }}>Error: {searchError}</div>
            )}
        </div>
    );
}
