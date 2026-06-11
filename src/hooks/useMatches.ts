import { useMemo } from "react";
import { getMatches } from "../lib/matching";
import type { Card } from "../types/types";

// Shared by DeckComparator and StoreSearch: empty while either side is
// loading so stale results never flash during a refetch.
export default function useMatches(
    isLoading: boolean,
    searchCards: Card[],
    repositoryCards: Card[],
): Card[] {
    return useMemo(() => {
        if (isLoading) return [];
        if (!searchCards.length || !repositoryCards.length) return [];
        return getMatches(searchCards, repositoryCards);
    }, [isLoading, searchCards, repositoryCards]);
}
