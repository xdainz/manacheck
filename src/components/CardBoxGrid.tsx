import useTranslation from "../hooks/useTranslation";
import type { Card } from "../types/types";
import CardBox from "./CardBox";

interface CardBoxGridProps {
    cardList: Card[];
    loading?: boolean;
    skeletonCount?: number;
}

function CardBoxGrid({
    cardList,
    loading = false,
    skeletonCount = 4,
}: CardBoxGridProps) {
    const { t } = useTranslation();

    if (loading) {
        return (
            <div className="cardboxgrid col-12" aria-busy="true">
                {Array.from({ length: skeletonCount }).map((_, i) => (
                    <div
                        className="cardbox row skeleton"
                        key={`skeleton-${i}`}
                        aria-hidden="true"
                    >
                        <div className="col">
                            <div className="skeleton-block skeleton-line skeleton-title" />
                            <div className="skeleton-block skeleton-line skeleton-lg" />
                            <div className="skeleton-block skeleton-line skeleton-md" />
                            <div className="skeleton-block skeleton-line skeleton-md" />
                            <div className="skeleton-block skeleton-line skeleton-price" />
                        </div>
                        <div className="col">
                            <div className="skeleton-block skeleton-media" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (cardList.length < 1) {
        return <p className="text-center py-5">{t("grid.noMatches")}</p>;
    }
    return (
        <div className="cardboxgrid col-12">
            {cardList.map((c, i) => (
                <CardBox
                    name={c.name}
                    isFoil={c.isFoil}
                    set={c.set}
                    collector_number={c.collector_number}
                    rarity={c.rarity}
                    quantity={c.quantity}
                    image_url={c.image_url}
                    ck_price={c.ck_price}
                    special_price={c.special_price}
                    key={`${c.name}-${i}`}
                />
            ))}
        </div>
    );
}

export default CardBoxGrid;
