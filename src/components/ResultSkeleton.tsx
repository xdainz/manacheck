import CardBoxGrid from "./CardBoxGrid";

// Placeholder shown while decklists are being fetched: a skeleton of the
// SearchResult summary box followed by a skeleton card grid.
export default function ResultSkeleton() {
    return (
        <>
            <div
                className="box mt-3 mb-3 deck-comparator skeleton-result"
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
    );
}
