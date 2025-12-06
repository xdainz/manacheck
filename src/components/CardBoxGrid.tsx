import type { Card } from "../types/CardType";
import CardBox from "./CardBox";

interface CardBoxGridProps {
    cardList: Card[];
}

function CardBoxGrid({ cardList }: CardBoxGridProps) {
    if (cardList.length < 1) {
        return <p className="text-center py-5">No matches found :^(</p>;
    }
    return (
        <div className="cardboxgrid col-12">
            {cardList.map((c, i) => (
                <CardBox
                    Name={c.Name}
                    Set={c.Set}
                    Collector_number={c.Collector_number}
                    Rarity={c.Rarity}
                    Quantity={c.Quantity}
                    image_url={c.image_url}
                    ck_price={c.ck_price}
                    key={`${c.Name}-${i}`}
                />
            ))}
        </div>
    );
}

export default CardBoxGrid;
