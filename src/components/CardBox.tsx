import { useState } from "react";
import type { Card } from "../types/types";

const SPECIAL_PRICE_HINT =
    "This card might be priced differently, ask the seller.";

function CardBox(card: Card) {
    const [showHint, setShowHint] = useState(false);

    // Tooltip opens on hover/focus via CSS; the click toggle covers touch
    // devices, where neither hover nor title attributes work.
    const specialPriceMark = card.special_price ? (
        <span
            className={
                "special-price-asterisk" + (showHint ? " show-tooltip" : "")
            }
            role="button"
            tabIndex={0}
            aria-label={SPECIAL_PRICE_HINT}
            data-tooltip={SPECIAL_PRICE_HINT}
            onClick={() => setShowHint((value) => !value)}
            onBlur={() => setShowHint(false)}
        >
            *
        </span>
    ) : null;

    return (
        <div className="cardbox row">
            <div className="col">
                <h5>{card.Name}</h5>
                <p className="label">
                    Set: <label className="label-value">{card.Set}</label>
                </p>
                <p className="label">
                    Number:{" "}
                    <label className="label-value">
                        {card.Collector_number}
                    </label>
                </p>
                <p className="label">
                    Rarity: <label className="label-value">{card.Rarity}</label>
                </p>
                <p className="label">
                    Quantity:{" "}
                    <label className="label-value">{card.Quantity}</label>
                </p>
                {card.ck_price ? (
                    <p className="price">
                        ${card.ck_price}
                        {specialPriceMark}
                    </p>
                ) : (
                    <p className="no-price">
                        Pricing Unavailable{specialPriceMark}
                    </p>
                )}
            </div>
            <div className="col">
                <img
                    src={card.image_url}
                    alt={card.Name + " image"}
                    className="image"
                />
            </div>
        </div>
    );
}

export default CardBox;
