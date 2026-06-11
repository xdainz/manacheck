import { useState } from "react";
import useDeckFetcher from "../hooks/useDeckFetcher";
import useMatches from "../hooks/useMatches";
import useTranslation from "../hooks/useTranslation";
import CardBoxGrid from "./CardBoxGrid";
import DeckLinkInput from "./DeckLinkInput";
import ResultSkeleton from "./ResultSkeleton";
import SearchResult from "./SearchResult";

export default function DeckComparator() {
    const { t } = useTranslation();

    const {
        loading: searchLoading,
        error: searchError,
        cards: searchCards,
        fetchDeck: searchFetchDeck,
    } = useDeckFetcher();

    const {
        loading: repositoryLoading,
        error: repositoryError,
        cards: repositoryCards,
        fetchDeck: repositoryFetchDeck,
    } = useDeckFetcher();

    const [searchLink, setSearchLink] = useState("");
    const [repositoryLink, setRepositoryLink] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    const handleFetch = async (e: React.FormEvent) => {
        e.preventDefault();
        setHasSearched(true);

        try {
            await Promise.all([
                searchFetchDeck(searchLink.trim()),
                repositoryFetchDeck(repositoryLink.trim()),
            ]);
        } catch {
            // errors are handled inside useDeckFetcher
        }
    };

    const isLoading = searchLoading || repositoryLoading;
    const errorMessage = searchError || repositoryError;

    const matches = useMatches(isLoading, searchCards, repositoryCards);

    return (
        <div>
            <div className="box mx-auto deck-comparator">
                <h1>{t("comparator.title")}</h1>
                <form onSubmit={handleFetch} className="form-stack">
                    <label>{t("comparator.searchLabel")}</label>
                    <DeckLinkInput
                        value={searchLink}
                        onChange={setSearchLink}
                        placeholder={t("comparator.searchPlaceholder")}
                        clearAriaLabel={t("comparator.clearSearch")}
                        disabled={isLoading}
                    />
                    <label>{t("comparator.repositoryLabel")}</label>
                    <DeckLinkInput
                        value={repositoryLink}
                        onChange={setRepositoryLink}
                        placeholder={t("comparator.repositoryPlaceholder")}
                        clearAriaLabel={t("comparator.clearRepository")}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="button submit-button"
                        disabled={isLoading}
                    >
                        {t("comparator.submit")}
                    </button>
                </form>
                {errorMessage && (
                    <div style={{ color: "crimson" }}>
                        {t("common.error")} {errorMessage}
                    </div>
                )}
            </div>
            {hasSearched && (
                <div>
                    {isLoading ? (
                        <div className="max-width">
                            <ResultSkeleton />
                        </div>
                    ) : (
                        <>
                            {matches.length > 0 && (
                                <SearchResult margin_top="3" list={matches} />
                            )}
                            <CardBoxGrid cardList={matches} />
                            {matches.length > 0 && (
                                <SearchResult margin_top="2" list={matches} />
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
