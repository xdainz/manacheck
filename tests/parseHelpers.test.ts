/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from "vitest";
import { parseManabox, parseMoxfield } from "../src/hooks/useDeckFetcher";

describe("parseManabox", () => {
    it("parses minimal manabox html with props", () => {
        // Construct a minimal data object matching the updated manabox shape
        const dataObj: any = {
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
        expect(parsed[0].Name).toBe("Alpha");
        expect(parsed[0].Set).toBe("XYZ");
        expect(parsed[0].Quantity).toBe(2);
        expect(parsed[0].image_url).toBe("https://example.com/img.jpg");
        // ck_price is rounded to 2 decimals in the parser
        expect(parsed[0].ck_price).toBeCloseTo(3.46, 2);
    });
});

describe("parseMoxfield", () => {
    it("parses moxfield-like object", () => {
        const obj: any = {
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
        expect(parsed[0].Name).toBe("Beta");
        expect(parsed[0].Set).toBe("AB");
        expect(parsed[0].Quantity).toBe(4);
        expect(parsed[0].image_url).toContain(
            "https://cards.scryfall.io/normal/front"
        );
        expect(parsed[0].ck_price).toBe(1.23);
    });
});
