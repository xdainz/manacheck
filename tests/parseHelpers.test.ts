/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from "vitest";
import {
    ArchidektDeck,
    DeckParseError,
    parseArchidekt,
    parseManabox,
    parseMoxfield,
} from "../src/lib/parsers";

describe("parseManabox", () => {
    it("parses minimal manabox html with props", () => {
        // Construct a minimal data object matching the updated manabox shape
        const dataObj = {
            deck: [
                null,
                {
                    cards: [
                        null,
                        [
                            [
                                0,
                                {
                                    name: [0, "Alpha"],
                                    setId: [0, "xyz"],
                                    collectorNumber: [0, "1"],
                                    rarity: [0, "rare"],
                                    quantity: [0, 2],
                                    images: [
                                        null,
                                        [
                                            [
                                                0,
                                                {
                                                    imageUrlNormal: [
                                                        null,
                                                        "https://example.com/img.jpg",
                                                    ],
                                                },
                                            ],
                                        ],
                                    ],
                                    pricing: [
                                        null,
                                        {
                                            cardKingdom: [
                                                null,
                                                {
                                                    value: [null, 3.456],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        ],
                    ],
                },
            ],
        };

        const json = JSON.stringify(dataObj);
        // escape quotes as &quot; to match what the parser expects
        const escaped = json.replace(/"/g, "&quot;");

        const html = `<html><body><astro-island></astro-island><astro-island props="${escaped}"></astro-island></body></html>`;

        const parsed = parseManabox(html);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].name).toBe("Alpha");
        expect(parsed[0].set).toBe("XYZ");
        expect(parsed[0].quantity).toBe(2);
        expect(parsed[0].image_url).toBe("https://example.com/img.jpg");
        // ck_price is rounded to 2 decimals in the parser
        expect(parsed[0].ck_price).toBeCloseTo(3.46, 2);
    });

    it("throws DeckParseError when the page has no deck island", () => {
        const html = `<html><body><p>Some unrelated page</p></body></html>`;
        expect(() => parseManabox(html)).toThrow(DeckParseError);
    });

    it("throws DeckParseError when the props shape is unrecognized", () => {
        const escaped = JSON.stringify({ deck: [null, {}] }).replace(
            /"/g,
            "&quot;",
        );
        const html = `<html><body><astro-island></astro-island><astro-island props="${escaped}"></astro-island></body></html>`;
        expect(() => parseManabox(html)).toThrow(DeckParseError);
    });
});

describe("parseMoxfield", () => {
    it("parses moxfield-like object", () => {
        const obj = {
            boards: {
                mainboard: {
                    cards: {
                        a: {
                            card: {
                                name: "Beta",
                                set: "ab",
                                cn: "10",
                                rarity: "common",
                                // the parser now uses `scryfall_id` to build image urls
                                scryfall_id: "12abcdef",
                                prices: { ck: 1.23 },
                            },
                            quantity: 4,
                            isFoil: false,
                        },
                    },
                },
                sideboard: { cards: {} },
                maybeboard: { cards: {} },
                commanders: { cards: {} },
                companions: { cards: {} },
                signatureSpells: { cards: {} },
            },
        };

        const parsed = parseMoxfield(obj);
        expect(parsed.length).toBeGreaterThan(0);
        expect(parsed[0].name).toBe("Beta");
        expect(parsed[0].set).toBe("AB");
        expect(parsed[0].quantity).toBe(4);
        expect(parsed[0].image_url).toContain(
            "https://cards.scryfall.io/normal/front",
        );
        expect(parsed[0].ck_price).toBe(1.23);
    });

    it("throws DeckParseError when the response has no boards", () => {
        expect(() => parseMoxfield({})).toThrow(DeckParseError);
    });
});

describe("parseArchidekt", () => {
    it("parses archidekt Next.js response shape with cardMap", () => {
        const obj = {
            pageProps: {
                redux: {
                    deck: {
                        cardMap: {
                            wonder: {
                                name: "Wonder",
                                setCode: "tdc",
                                collectorNumber: "170",
                                rarity: "uncommon",
                                qty: 1,
                                modifier: "Normal",
                                uid: "567abd78-d4a3-4a33-9b5b-b5ca361059cc",
                                prices: { ck: 3.99, ckFoil: 0 },
                            },
                            artificer: {
                                name: "Artificer's Assistant",
                                setCode: "plst",
                                collectorNumber: "DOM-44",
                                rarity: "common",
                                qty: 1,
                                modifier: "Normal",
                                uid: "852ceabf-ce14-4fa9-90b5-895b5cb5ca7f",
                                prices: { ck: 0.49, ckFoil: 0 },
                            },
                        },
                    },
                },
            },
        };
        const parsed = parseArchidekt(obj);

        expect(parsed).toHaveLength(2);

        const wonder = parsed.find((c) => c.name === "Wonder");
        expect(wonder).toBeDefined();
        expect(wonder?.set).toBe("TDC");
        expect(wonder?.collector_number).toBe("170");
        expect(wonder?.rarity).toBe("Uncommon");
        expect(wonder?.quantity).toBe(1);
        expect(wonder?.isFoil).toBe(false);
        expect(wonder?.image_url).toBe(
            "https://cards.scryfall.io/normal/front/5/6/567abd78-d4a3-4a33-9b5b-b5ca361059cc.jpg",
        );
        expect(wonder?.ck_price).toBe(3.99);

        const artificer = parsed.find((c) => c.name === "Artificer's Assistant");
        expect(artificer).toBeDefined();
        expect(artificer?.set).toBe("PLST");
        expect(artificer?.collector_number).toBe("DOM-44");
        expect(artificer?.ck_price).toBe(0.49);
    });

    it("parses minimal archidekt object with cardMap", () => {
        const obj = {
            pageProps: {
                redux: {
                    deck: {
                        cardMap: {
                            entry1: {
                                name: "Ragavan, Nimble Pilferer",
                                setCode: "mh2",
                                collectorNumber: "138",
                                rarity: "mythic",
                                qty: 2,
                                modifier: "Foil",
                                uid: "a9738cda-adb1-47fb-9f4c-cc93022544dd",
                                prices: { ck: 45.0, ckFoil: 65.0 },
                            },
                        },
                    },
                },
            },
        };

        const parsed = parseArchidekt(obj);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].name).toBe("Ragavan, Nimble Pilferer");
        expect(parsed[0].set).toBe("MH2");
        expect(parsed[0].collector_number).toBe("138");
        expect(parsed[0].rarity).toBe("Mythic");
        expect(parsed[0].quantity).toBe(2);
        expect(parsed[0].isFoil).toBe(true);
        expect(parsed[0].image_url).toBe(
            "https://cards.scryfall.io/normal/front/a/9/a9738cda-adb1-47fb-9f4c-cc93022544dd.jpg",
        );
        expect(parsed[0].ck_price).toBe(65.0);
    });

    it("parses API response with cards array", () => {
        const obj = {
            cards: [
                {
                    quantity: 1,
                    modifier: "Normal",
                    card: {
                        collectorNumber: "100",
                        rarity: "rare",
                        uid: "12345678-abcd-ef01-2345-6789abcdef01",
                        edition: { editioncode: "abc" },
                        oracleCard: { name: "Sol Ring" },
                        prices: { ck: 1.5 },
                    },
                },
            ],
        };

        const parsed = parseArchidekt(obj);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].name).toBe("Sol Ring");
        expect(parsed[0].set).toBe("ABC");
        expect(parsed[0].collector_number).toBe("100");
        expect(parsed[0].rarity).toBe("Rare");
        expect(parsed[0].quantity).toBe(1);
        expect(parsed[0].isFoil).toBe(false);
        expect(parsed[0].image_url).toBe(
            "https://cards.scryfall.io/normal/front/1/2/12345678-abcd-ef01-2345-6789abcdef01.jpg",
        );
        expect(parsed[0].ck_price).toBe(1.5);
    });

    it("throws DeckParseError when response shape is invalid or missing cards", () => {
        expect(() => parseArchidekt({} as unknown as ArchidektDeck)).toThrow(
            DeckParseError,
        );
        expect(() => parseArchidekt(null as unknown as ArchidektDeck)).toThrow(
            DeckParseError,
        );
        expect(() =>
            parseArchidekt({ pageProps: {} } as unknown as ArchidektDeck),
        ).toThrow(DeckParseError);
    });
});

