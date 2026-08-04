import { useCallback, useMemo, useState } from "react";
import type { Card } from "../types/types";
import {
    defaultStoreSearchFilters,
    filterStoreCards,
    getAvailableRarities,
    getAvailableSets,
    getPriceBounds,
    getTotalPages,
    paginateCards,
    type StoreSearchFilters,
} from "../lib/storeSearch";

const PAGE_SIZE = 12;

export default function useStoreSearch(cards: Card[], pageSize = PAGE_SIZE) {
    const [filters, setFiltersState] = useState<StoreSearchFilters>(
        defaultStoreSearchFilters,
    );
    const [page, setPage] = useState(1);

    const priceBounds = useMemo(() => getPriceBounds(cards), [cards]);

    const setFilters = useCallback((next: StoreSearchFilters) => {
        setFiltersState(next);
        setPage(1);
    }, []);

    const availableSets = useMemo(() => getAvailableSets(cards), [cards]);
    const availableRarities = useMemo(
        () => getAvailableRarities(cards),
        [cards],
    );

    const filteredCards = useMemo(
        () => filterStoreCards(cards, filters),
        [cards, filters],
    );

    const totalPages = getTotalPages(filteredCards.length, pageSize);
    const currentPage = Math.min(page, totalPages);

    const paginatedCards = useMemo(
        () => paginateCards(filteredCards, currentPage, pageSize),
        [filteredCards, currentPage, pageSize],
    );

    const resetFilters = () => {
        setFiltersState(defaultStoreSearchFilters);
        setPage(1);
    };

    return {
        filters,
        setFilters,
        filteredCards,
        paginatedCards,
        page: currentPage,
        totalPages,
        setPage,
        availableSets,
        availableRarities,
        priceBounds,
        resetFilters,
    };
}
