import { useState } from "react";
import useTranslation from "../hooks/useTranslation";
import type { Card } from "../types/types";

function StoreCardBox(card: Card) {
    const { t } = useTranslation();
    const [showHint, setShowHint] = useState(false);

    const specialPriceHint = t("card.specialPriceHint");

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
        <div className="cardbox row store-cardbox">
            <div className="col">
                <h5>{card.name}</h5>
                <p className="label">
                    {t("card.set")}{" "}
                    <label className="label-value">{card.set}</label>
                </p>
                <p className="label">
                    {t("card.number")}{" "}
                    <label className="label-value">
                        {card.collector_number}
                    </label>
                </p>
                <p className="label">
                    {t("card.quantity")}{" "}
                    <label className="label-value">{card.quantity}</label>
                </p>

                {card.isFoil ? <p className="label foil-text">Foil</p> : null}

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
                <div className="card-image">
                    <img
                        src={card.image_url}
                        alt={card.name + " image"}
                        className="image"
                    />
                    <div className={card.isFoil ? "foil" : ""}></div>
                </div>
            </div>
        </div>
    );
}

export default StoreCardBox;
