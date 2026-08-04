import type { Card } from "../types/types";

export type SortOption =
    | "name-asc"
    | "name-desc"
    | "price-asc"
    | "price-desc"
    | "quantity-desc";

export interface StoreSearchFilters {
    query: string;
    set: string | null;
    rarities: string[];
    foilOnly: boolean;
    minPrice: number | null;
    maxPrice: number | null;
    sortBy: SortOption;
}

export const defaultStoreSearchFilters: StoreSearchFilters = {
    query: "",
    set: null,
    rarities: [],
    foilOnly: false,
    minPrice: null,
    maxPrice: null,
    sortBy: "name-asc",
};

const RARITY_ORDER = ["Common", "Uncommon", "Rare", "Mythic"];

// Sets present in the current card list, alphabetically.
export function getAvailableSets(cards: Card[]): string[] {
    const sets = new Set(
        cards.map((card) => card.set).filter((set): set is string => !!set),
    );
    return Array.from(sets).sort();
}

// Rarities present in the current card list, common -> mythic first, then
// anything unrecognized alphabetically.
export function getAvailableRarities(cards: Card[]): string[] {
    const present = new Set(
        cards
            .map((card) => card.rarity)
            .filter((rarity): rarity is string => !!rarity),
    );
    const known = RARITY_ORDER.filter((rarity) => present.has(rarity));
    const rest = Array.from(present)
        .filter((rarity) => !RARITY_ORDER.includes(rarity))
        .sort();
    return [...known, ...rest];
}

// Min/max ck_price across the current card list, for sizing the price
// range slider. Falls back to {0, 0} when there are no cards yet.
export function getPriceBounds(cards: Card[]): { min: number; max: number } {
    if (cards.length === 0) return { min: 0, max: 0 };

    let min = Infinity;
    let max = -Infinity;
    for (const card of cards) {
        const price = card.ck_price ?? 0;
        if (price < min) min = price;
        if (price > max) max = price;
    }
    return { min: Math.floor(min), max: Math.ceil(max) };
}

export function paginateCards(
    cards: Card[],
    page: number,
    pageSize: number,
): Card[] {
    const start = (page - 1) * pageSize;
    return cards.slice(start, start + pageSize);
}

export function getTotalPages(totalItems: number, pageSize: number): number {
    return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function sortStoreCards(cards: Card[], sortBy: SortOption): Card[] {
    const sorted = [...cards];
    switch (sortBy) {
        case "name-asc":
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "name-desc":
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case "price-asc":
            sorted.sort((a, b) => (a.ck_price ?? 0) - (b.ck_price ?? 0));
            break;
        case "price-desc":
            sorted.sort((a, b) => (b.ck_price ?? 0) - (a.ck_price ?? 0));
            break;
        case "quantity-desc":
            sorted.sort((a, b) => (b.quantity ?? 0) - (a.quantity ?? 0));
            break;
    }
    return sorted;
}

export function filterStoreCards(
    cards: Card[],
    filters: StoreSearchFilters,
): Card[] {
    const query = filters.query.trim().toLowerCase();
    const rarityFilter = new Set(filters.rarities);

    const filtered = cards.filter((card) => {
        if (query && !card.name.toLowerCase().includes(query)) return false;
        if (filters.set && card.set !== filters.set) return false;
        if (rarityFilter.size && !rarityFilter.has(card.rarity)) return false;
        if (filters.foilOnly && !card.isFoil) return false;
        if (filters.minPrice != null && card.ck_price < filters.minPrice)
            return false;
        if (filters.maxPrice != null && card.ck_price > filters.maxPrice)
            return false;
        return true;
    });

    return sortStoreCards(filtered, filters.sortBy);
}
