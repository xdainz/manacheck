import { useState } from "react";
import useDeckFetcher from "../hooks/useDeckFetcher";
import CardBoxGrid from "./CardBoxGrid";

export default function DeckFetcherDemo() {
    const { loading, error, cards, fetchDeck } = useDeckFetcher();
    const [link, setLink] = useState("");

    return (
        <div className="container">
            <h3>Deck Fetcher Demo</h3>
            <div>
                <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://moxfield.com/decks/... or https://manabox.app/..."
                    className="form-control"
                />
                <button
                    onClick={() => fetchDeck(link)}
                    className="btn btn-primary"
                >
                    Fetch
                </button>
            </div>

            {loading && <div>Loading…</div>}
            {error && <div style={{ color: "crimson" }}>Error: {error}</div>}

            <div>
                <h4>Different Cards ({cards.length})</h4>
                <CardBoxGrid cardList={cards} />
            </div>
        </div>
    );
}
