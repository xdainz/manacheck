import { useState, useEffect } from "react";
import type { Card } from "../types/CardType";
import useDeckFetcher from "../hooks/useDeckFetcher";
import CardBoxGrid from "./CardBoxGrid";
import { getMatches } from "../hooks/compareDecks";
import ExportControls from "./ExportControls";

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
    const [matches, setMatches] = useState<Card[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleFetch = async (e: React.FormEvent) => {
        e.preventDefault();
        setHasSearched(true);
        setMatches([]);

        try {
            // Fetch both decks in parallel
            await Promise.all([
                searchFetchDeck(searchLink.trim()),
                repositoryFetchDeck(repositoryLink.trim()),
            ]);
        } catch (e) {
            // errors are handled inside useDeckFetcher; nothing to do here
        }
    };

    // When either deck updates (after fetch), compute matches.
    useEffect(() => {
        // Only compute once both fetches are idle (not loading)
        if (searchLoading || repositoryLoading) return;

        // If either list is empty, clear matches
        if (!searchCards.length || !repositoryCards.length) {
            setMatches([]);
            return;
        }

        const found = getMatches(searchCards, repositoryCards);
        setMatches(found);
    }, [searchCards, repositoryCards, searchLoading, repositoryLoading]);

    const isLoading = searchLoading || repositoryLoading;
    const errorMessage = searchError || repositoryError;

    return (
        <div className="container">
            <div className="box mx-auto">
                <h1>Decklist Comparator</h1>
                <form onSubmit={handleFetch}>
                    <label>Search Link:</label>
                    <input
                        value={searchLink}
                        onChange={(e) => setSearchLink(e.target.value)}
                        placeholder="List you are looking for..."
                        className="form-control"
                        required
                    />
                    <label>Repository Link:</label>
                    <input
                        value={repositoryLink}
                        onChange={(e) => setRepositoryLink(e.target.value)}
                        placeholder="List to filter through..."
                        className="form-control"
                        required
                    />
                    <button
                        type="submit"
                        className="button mt-3"
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
                <div className="mx-auto pt-3">
                    <h4>Matching Cards ({matches.length})</h4>
                    {matches.length > 0 && <ExportControls list={matches} />}
                    <CardBoxGrid cardList={matches} />
                    {matches.length > 0 && <ExportControls list={matches} />}
                </div>
            )}
        </div>
    );
}
