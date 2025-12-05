import { useState } from "react";
import useDeckFetcher from "../hooks/useDeckFetcher";

export default function DeckFetcherDemo() {
    const { loading, error, cards, fetchDeck } = useDeckFetcher();
    const [link, setLink] = useState("");

    return (
        <div style={{ padding: 16 }}>
            <h3>Deck Fetcher Demo</h3>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://moxfield.com/decks/... or https://manabox.app/..."
                    style={{ flex: 1 }}
                />
                <button onClick={() => fetchDeck(link)}>Fetch</button>
            </div>

            {loading && <div>Loading…</div>}
            {error && <div style={{ color: "crimson" }}>Error: {error}</div>}

            <div>
                <h4>Different Cards ({cards.length})</h4>
                <ul>
                    {cards.map((c, i) => (
                        <li key={`${c.Name}-${i}`}>
                            {c.Name} — {c.Set} #{c["Collector Number"]} —{" "}
                            {c.Rarity} ×{c.Quantity}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
