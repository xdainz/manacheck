import type { Card } from "../types/types";

// Manabox serializes deck data as Astro island props: every value is wrapped
// in a [flags, value] tuple, so all access below goes through index [1].
type ManaboxImageEntry = [unknown, { imageUrlNormal?: [unknown, string] }];
type ManaboxImages = [unknown, ManaboxImageEntry[]];
type ManaboxPriceValue = [unknown, number];
type ManaboxCardKingdom = [unknown, { value?: ManaboxPriceValue }];
type ManaboxPricing = [unknown, { cardKingdom?: ManaboxCardKingdom }];
type ManaboxCardData = {
    images?: ManaboxImages;
    pricing?: ManaboxPricing;
    name?: [unknown, string];
    setId?: [unknown, string | number];
    collectorNumber?: [unknown, string | number];
    rarity?: [unknown, string];
    quantity?: [unknown, number];
};
type ManaboxCardEntry = [unknown, ManaboxCardData];
type ManaboxCards = [unknown, ManaboxCardEntry[]];
type ManaboxDeck = [unknown, { cards?: ManaboxCards }];
type ManaboxProps = { deck?: ManaboxDeck };

type MoxfieldCard = {
    name?: string;
    set?: string;
    cn?: string | number;
    rarity?: string;
    scryfall_id?: string;
    prices?: { ck?: number };
};

type MoxfieldCardEntry = {
    card?: MoxfieldCard;
    quantity?: number;
    isFoil: boolean;
};

type MoxfieldBoard = {
    cards?: Record<string, MoxfieldCardEntry>;
};

export type MoxfieldDeck = {
    boards?: Record<string, MoxfieldBoard>;
};

// Thrown when a response is readable but does not have the shape we expect,
// i.e. the upstream site likely changed its markup or API. Callers surface
// this to the user instead of showing an empty "no matches" result.
export class DeckParseError extends Error {}

function unescapeHtmlEntities(s: string) {
    return s
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
}

export function parseManabox(htmlText: string): Card[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const islands = Array.from(doc.getElementsByTagName("astro-island"));
    if (islands.length < 2) {
        throw new DeckParseError(
            "Could not find deck data in the Manabox page. Manabox may have changed their site layout.",
        );
    }

    const props = islands[1].getAttribute("props") || "";
    const unescaped = unescapeHtmlEntities(props);

    let dataObj: ManaboxProps;
    try {
        dataObj = JSON.parse(unescaped) as ManaboxProps;
    } catch (e) {
        throw new DeckParseError(
            "Failed to parse manabox JSON props: " + String(e),
            { cause: e },
        );
    }

    const raw_card_list = dataObj?.deck?.[1]?.cards?.[1];
    if (!Array.isArray(raw_card_list)) {
        throw new DeckParseError(
            "Unexpected Manabox deck data shape. Manabox may have changed their site layout.",
        );
    }

    return raw_card_list.map((card) => {
        const data = card[1];

        const imgUrl = data?.images?.[1]?.[0]?.[1]?.imageUrlNormal?.[1];
        const ck =
            Math.round(
                (data?.pricing?.[1]?.cardKingdom?.[1]?.value?.[1] ?? 0) * 100,
            ) / 100; // hack to round to 2 decimals

        return {
            name: data?.name?.[1] ?? "",
            set: (data?.setId?.[1] ?? "").toString().toUpperCase(),
            collector_number: data?.collectorNumber?.[1] ?? "",
            rarity: String(data?.rarity?.[1] ?? "").replace(/^./, (c) =>
                c.toUpperCase(),
            ),
            quantity: Number(data?.quantity?.[1] ?? 0),
            image_url: imgUrl ?? "",
            ck_price: ck,
        } as Card;
    });
}

export function parseMoxfield(dataObj: MoxfieldDeck): Card[] {
    const cleaned: Card[] = [];
    const categories = [
        "mainboard",
        "sideboard",
        "maybeboard",
        "commanders",
        "companions",
        "signatureSpells",
    ];
    const boards = dataObj?.boards;
    if (!boards) {
        throw new DeckParseError(
            "Unexpected Moxfield API response shape. Moxfield may have changed their API.",
        );
    }

    categories.forEach((cat) => {
        const cardObj = boards[cat]?.cards;
        if (!cardObj) return;
        Object.values(cardObj).forEach((entry) => {
            const card = entry.card;
            const quantity = entry.quantity ?? 0;

            const baseImgUrl = "https://cards.scryfall.io/normal/front";
            const cardScryfallId = card?.scryfall_id ?? "";
            const firstNumber = cardScryfallId[0] ?? "";
            const secondNumber = cardScryfallId[1] ?? "";
            const imgUrl = cardScryfallId
                ? `${baseImgUrl}/${firstNumber}/${secondNumber}/${cardScryfallId}.jpg`
                : "";

            cleaned.push({
                name: card?.name ?? "",
                type: "TEST VALUE",
                color_identity: "TEST VALUE",
                cmc: 777,
                isFoil: entry.isFoil || false,
                set: (card?.set ?? "").toString().toUpperCase(),
                collector_number: (card?.cn ?? "").toString(),
                rarity: String(card?.rarity ?? "").replace(/^./, (c) =>
                    c.toUpperCase(),
                ),
                quantity: Number(quantity),
                image_url: imgUrl,
                ck_price: card?.prices?.ck ?? 0,
                oracle_text: "TEST VALUE",
            });
        });
    });

    return cleaned;
}
