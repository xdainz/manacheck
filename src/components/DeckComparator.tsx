import { useState, useMemo } from "react";
import useDeckFetcher from "../hooks/useDeckFetcher";
import CardBoxGrid from "./CardBoxGrid";
import { getMatches } from "../hooks/compareDecks";
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

    const matches = useMemo(() => {
        // keep UI empty while fetching
        if (isLoading) return [];
        if (!searchCards.length || !repositoryCards.length) return [];
        return getMatches(searchCards, repositoryCards);
    }, [isLoading, searchCards, repositoryCards]);

    return (
        <div className="container">
            <div className="box mx-auto deck-comparator">
                <h1>Decklist Comparator</h1>
                <form onSubmit={handleFetch} className="form-stack">
                    <label>Search Link:</label>
                    <div className="input-row">
                        <input
                            value={searchLink}
                            onChange={(e) => setSearchLink(e.target.value)}
                            placeholder="List you are looking for..."
                            className="form-control"
                            required
                        />
                        <button
                            type="button"
                            className="input-clear"
                            onClick={() => setSearchLink("")}
                            disabled={!searchLink || isLoading}
                            aria-label="Clear search link"
                        >
                            Clear
                        </button>
                    </div>
                    <label>Repository Link:</label>
                    <div className="input-row">
                        <input
                            value={repositoryLink}
                            onChange={(e) => setRepositoryLink(e.target.value)}
                            placeholder="List to filter through..."
                            className="form-control"
                            required
                        />
                        <button
                            type="button"
                            className="input-clear"
                            onClick={() => setRepositoryLink("")}
                            disabled={!repositoryLink || isLoading}
                            aria-label="Clear repository link"
                        >
                            Clear
                        </button>
                    </div>
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
                        <>
                            <div
                                className="box mb-3 mt-3 search-result skeleton-result"
                                role="status"
                                aria-live="polite"
                                aria-busy="true"
                            >
                                <div className="skeleton-block skeleton-line skeleton-title" />
                                <div className="skeleton-row">
                                    <div className="skeleton-block skeleton-line skeleton-sm" />
                                    <div className="skeleton-block skeleton-line skeleton-md" />
                                </div>
                                <div className="skeleton-block skeleton-line skeleton-price" />
                            </div>
                            <CardBoxGrid cardList={[]} loading />
                        </>
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
