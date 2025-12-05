import type { Card } from "../types/CardType";

function CardBox(card: Card) {
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
                    <p className="price">${card.ck_price}</p>
                ) : (
                    <p className="no-price">Pricing Unavailable</p>
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
