import useTranslation from "../hooks/useTranslation";
import type { TranslationKey } from "../lib/translations";
import type { SortOption, StoreSearchFilters } from "../lib/storeSearch";
import PriceRangeSlider from "./PriceRangeSlider";

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
    "quantity-desc",
];

const SORT_LABEL_KEYS: Record<SortOption, TranslationKey> = {
    "name-asc": "search.sort.name-asc",
    "name-desc": "search.sort.name-desc",
    "price-asc": "search.sort.price-asc",
    "price-desc": "search.sort.price-desc",
    "quantity-desc": "search.sort.quantity-desc",
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

    const priceMin = filters.minPrice ?? priceBounds.min;
    const priceMax = filters.maxPrice ?? priceBounds.max;

    return (
        <div className="box advanced-search mb-3">
            <div className="row g-3">
                <div className="col-12 col-md-6">
                    <label htmlFor="search-name">
                        {t("search.nameLabel")}
                    </label>
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

                <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
                        <label htmlFor="search-sets">
                            {t("search.sets")}
                        </label>
                        <select
                            id="search-sets"
                            className="form-control"
                            value={filters.set ?? ""}
                            onChange={(e) =>
                                onChange({
                                    ...filters,
                                    set: e.target.value || null,
                                })
                            }
                        >
                            <option value="">{t("search.allSets")}</option>
                            {availableSets.map((set) => (
                                <option value={set} key={set}>
                                    {set}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : null}

                {availableRarities.length > 0 ? (
                    <div className="col-12 col-md-6">
                        <span className="advanced-search-group-label">
                            {t("search.rarities")}
                        </span>
                        <div className="advanced-search-chip-group">
                            {availableRarities.map((rarity) => (
                                <label
                                    className="advanced-search-chip"
                                    key={rarity}
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.rarities.includes(
                                            rarity,
                                        )}
                                        onChange={() =>
                                            onChange({
                                                ...filters,
                                                rarities: toggleValue(
                                                    filters.rarities,
                                                    rarity,
                                                ),
                                            })
                                        }
                                    />
                                    {rarity}
                                </label>
                            ))}
                        </div>
                    </div>
                ) : null}

                <div className="col-6 col-md-3 d-flex align-items-end">
                    <label className="advanced-search-checkbox">
                        <input
                            type="checkbox"
                            checked={filters.foilOnly}
                            onChange={(e) =>
                                onChange({
                                    ...filters,
                                    foilOnly: e.target.checked,
                                })
                            }
                        />
                        {t("search.foilOnly")}
                    </label>
                </div>

                <div className="col-6 col-md-3">
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
                <p className="mb-0 text-muted">
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
