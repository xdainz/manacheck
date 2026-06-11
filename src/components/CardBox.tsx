import { useState } from "react";
import useTranslation from "../hooks/useTranslation";
import type { Card } from "../types/types";

function CardBox(card: Card) {
    const { t } = useTranslation();
    const [showHint, setShowHint] = useState(false);

    const specialPriceHint = t("card.specialPriceHint");

    // Tooltip opens on hover/focus via CSS; the click toggle covers touch
    // devices, where neither hover nor title attributes work.
    const specialPriceMark = card.special_price ? (
        <span
            className={
                "special-price-asterisk" + (showHint ? " show-tooltip" : "")
            }
            role="button"
            tabIndex={0}
            aria-label={specialPriceHint}
            data-tooltip={specialPriceHint}
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
                    {t("card.set")}{" "}
                    <label className="label-value">{card.Set}</label>
                </p>
                <p className="label">
                    {t("card.number")}{" "}
                    <label className="label-value">
                        {card.Collector_number}
                    </label>
                </p>
                <p className="label">
                    {t("card.rarity")}{" "}
                    <label className="label-value">{card.Rarity}</label>
                </p>
                <p className="label">
                    {t("card.quantity")}{" "}
                    <label className="label-value">{card.Quantity}</label>
                </p>
                {card.ck_price ? (
                    <p className="price">
                        ${card.ck_price}
                        {specialPriceMark}
                    </p>
                ) : (
                    <p className="no-price">
                        {t("card.noPrice")}
                        {specialPriceMark}
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
