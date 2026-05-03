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
                <form onSubmit={handleFetch}>
                    <label className="mt-3">Search Link:</label>
                    <input
                        value={searchLink}
                        onChange={(e) => setSearchLink(e.target.value)}
                        placeholder="List you are looking for..."
                        className="form-control"
                        required
                    />
                    <label className="mt-3">Repository Link:</label>
                    <input
                        value={repositoryLink}
                        onChange={(e) => setRepositoryLink(e.target.value)}
                        placeholder="List to filter through..."
                        className="form-control"
                        required
                    />
                    <button
                        type="submit"
                        className="button mt-3 submit-button"
                        disabled={isLoading}
                    >
                        Compare
                    </button>
                </form>
                {isLoading && <div>Loading…</div>}
                {errorMessage && (
                    <div style={{ color: "crimson" }}>
                        Error: {errorMessage}
                    </div>
                )}
            </div>
            {hasSearched && !isLoading && (
                <div>
                    {matches.length > 0 && <SearchResult list={matches} />}
                    <CardBoxGrid cardList={matches} />
                    {matches.length > 0 && <SearchResult list={matches} />}
                </div>
            )}
        </div>
    );
}
