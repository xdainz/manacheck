import { useState } from "react";
import useDeckFetcher from "../hooks/useDeckFetcher";
import useMatches from "../hooks/useMatches";
import CardBoxGrid from "./CardBoxGrid";
import DeckLinkInput from "./DeckLinkInput";
import ResultSkeleton from "./ResultSkeleton";
import SearchResult from "./SearchResult";

export default function DeckComparator() {
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
                <h1>Decklist Comparator</h1>
                <form onSubmit={handleFetch} className="form-stack">
                    <label>Search Link:</label>
                    <DeckLinkInput
                        value={searchLink}
                        onChange={setSearchLink}
                        placeholder="List you are looking for..."
                        clearAriaLabel="Clear search link"
                        disabled={isLoading}
                    />
                    <label>Repository Link:</label>
                    <DeckLinkInput
                        value={repositoryLink}
                        onChange={setRepositoryLink}
                        placeholder="List to filter through..."
                        clearAriaLabel="Clear repository link"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="button submit-button"
                        disabled={isLoading}
                    >
                        Compare
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
