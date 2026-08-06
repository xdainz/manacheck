import useTranslation from "../hooks/useTranslation";
import type { TranslationKey } from "../lib/translations";
import type { SortOption, StoreSearchFilters } from "../lib/storeSearch";
import PriceRangeSlider from "./PriceRangeSlider";
import { useState, useMemo } from "react";

interface StoreAdvancedSearchProps {
    filters: StoreSearchFilters;
    onChange: (filters: StoreSearchFilters) => void;
    onReset: () => void;
    availableSets: string[];
    availableRarities: string[];
    priceBounds: { min: number; max: number };
    resultCount: number;
    totalCount: number;
}

const SORT_OPTIONS: SortOption[] = [
    "name-asc",
    "name-desc",
    "price-asc",
    "price-desc",
];

const SORT_LABEL_KEYS: Record<SortOption, TranslationKey> = {
    "name-asc": "search.sort.name-asc",
    "name-desc": "search.sort.name-desc",
    "price-asc": "search.sort.price-asc",
    "price-desc": "search.sort.price-desc",
};

function toggleValue(list: string[], value: string): string[] {
    return list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];
}

function StoreAdvancedSearch({
    filters,
    onChange,
    onReset,
    availableSets,
    availableRarities,
    priceBounds,
    resultCount,
    totalCount,
}: StoreAdvancedSearchProps) {
    const { t } = useTranslation();
    const [setSearchInput, setSetSearchInput] = useState("");
    const [showSetDropdown, setShowSetDropdown] = useState(false);

    const priceMin = filters.minPrice ?? priceBounds.min;
    const priceMax = filters.maxPrice ?? priceBounds.max;

    const filteredSets = useMemo(() => {
        const query = setSearchInput.toLowerCase();
        return query
            ? availableSets.filter((set) => set.toLowerCase().includes(query))
            : availableSets;
    }, [setSearchInput, availableSets]);

    const handleSetInputChange = (value: string) => {
        setSetSearchInput(value);
        setShowSetDropdown(true);
    };

    const handleSetSelect = (set: string) => {
        onChange({ ...filters, set });
        setSetSearchInput("");
        setShowSetDropdown(false);
    };

    const handleSetClear = () => {
        onChange({ ...filters, set: null });
        setSetSearchInput("");
        setShowSetDropdown(false);
    };

    return (
        <div className="box advanced-search">
            <div className="row g-3">
                <div className="col-12">
                    <label htmlFor="search-name">{t("search.nameLabel")}</label>
                    <input
                        id="search-name"
                        type="text"
                        className="form-control"
                        placeholder={t("search.namePlaceholder")}
                        value={filters.query}
                        onChange={(e) =>
                            onChange({ ...filters, query: e.target.value })
                        }
                    />
                </div>

                <div className="col-12">
                    <span className="advanced-search-group-label">
                        {t("search.priceRange")}
                    </span>
                    {priceBounds.max > priceBounds.min ? (
                        <PriceRangeSlider
                            min={priceBounds.min}
                            max={priceBounds.max}
                            valueMin={priceMin}
                            valueMax={priceMax}
                            step={5}
                            minAriaLabel={t("search.minPrice")}
                            maxAriaLabel={t("search.maxPrice")}
                            onChange={(nextMin, nextMax) =>
                                onChange({
                                    ...filters,
                                    minPrice: nextMin,
                                    maxPrice: nextMax,
                                })
                            }
                        />
                    ) : (
                        <p className="mb-0 text-muted">${priceMin}</p>
                    )}
                </div>

                {availableSets.length > 0 ? (
                    <div className="col-12">
                        <label htmlFor="search-sets">{t("search.sets")}</label>
                        <div className="position-relative">
                            <input
                                id="search-sets"
                                type="text"
                                className="form-control"
                                placeholder={t("search.allSets")}
                                value={
                                    filters.set
                                        ? setSearchInput || filters.set
                                        : setSearchInput
                                }
                                onChange={(e) =>
                                    handleSetInputChange(e.target.value)
                                }
                                onFocus={() => setShowSetDropdown(true)}
                                onBlur={() =>
                                    setTimeout(
                                        () => setShowSetDropdown(false),
                                        100,
                                    )
                                }
                            />
                            {filters.set ? (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-link position-absolute end-0 top-50 translate-middle-y close-button"
                                    onClick={handleSetClear}
                                    title="Clear set filter"
                                >
                                    &times;
                                </button>
                            ) : null}
                            {showSetDropdown && filteredSets.length > 0 ? (
                                <div className="dropdown-menu show position-absolute w-100 mt-1">
                                    {filteredSets.map((set) => (
                                        <button
                                            key={set}
                                            type="button"
                                            className={`dropdown-item ${
                                                filters.set === set
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onMouseDown={(e) =>
                                                e.preventDefault()
                                            }
                                            onClick={() => handleSetSelect(set)}
                                        >
                                            {set}
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : null}

                {availableRarities.length > 0 ? (
                    <div className="col-12">
                        <span className="advanced-search-group-label">
                            {t("search.rarities")}
                        </span>
                        <div className="advanced-search-chip-group">
                            {availableRarities.map((rarity) => (
                                <button
                                    type="button"
                                    className={`advanced-search-chip${
                                        filters.rarities.includes(rarity)
                                            ? " selected"
                                            : ""
                                    }`}
                                    key={rarity}
                                    onClick={() =>
                                        onChange({
                                            ...filters,
                                            rarities: toggleValue(
                                                filters.rarities,
                                                rarity,
                                            ),
                                        })
                                    }
                                >
                                    {rarity}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : null}

                <div className="col-12">
                    <button
                        type="button"
                        className={`advanced-search-chip advanced-search-foil-chip${
                            filters.foilOnly ? " selected foil-text" : ""
                        }`}
                        onClick={() =>
                            onChange({
                                ...filters,
                                foilOnly: !filters.foilOnly,
                            })
                        }
                        aria-pressed={filters.foilOnly}
                    >
                        {t("search.foilOnly")}
                    </button>
                </div>

                <div className="col-12">
                    <label htmlFor="search-sort">{t("search.sortBy")}</label>
                    <select
                        id="search-sort"
                        className="form-control"
                        value={filters.sortBy}
                        onChange={(e) =>
                            onChange({
                                ...filters,
                                sortBy: e.target.value as SortOption,
                            })
                        }
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {t(SORT_LABEL_KEYS[option])}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="advanced-search-footer">
                <p className="mb-0 advanced-search-result-count">
                    {t("search.resultCount", {
                        count: resultCount,
                        total: totalCount,
                    })}
                </p>
                <button type="button" className="input-clear" onClick={onReset}>
                    {t("search.clear")}
                </button>
            </div>
        </div>
    );
}

export default StoreAdvancedSearch;
