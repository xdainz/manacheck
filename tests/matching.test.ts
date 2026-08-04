import { describe, it, expect } from "vitest";
import { getMatches } from "../src/lib/matching";
import type { Card } from "../src/types/types";

describe("getMatches", () => {
    it("returns repository cards present in search list by Name", () => {
        const searchList: Card[] = [
            {
                name: "Alpha",
                set: "X",
                collector_number: "1",
                rarity: "Rare",
                isFoil: true,
                quantity: 1,
                image_url: "",
                ck_price: 0,
            },
            {
                name: "Gamma",
                set: "Y",
                collector_number: "2",
                rarity: "Common",
                isFoil: false,
                quantity: 2,
                image_url: "",
                ck_price: 0,
            },
        ];

        const repositoryList: Card[] = [
            {
                name: "Alpha",
                set: "X",
                collector_number: "1",
                rarity: "Rare",
                isFoil: true,
                quantity: 1,
                image_url: "",
                ck_price: 0,
            },
            {
                name: "Beta",
                set: "Z",
                collector_number: "3",
                rarity: "Uncommon",
                isFoil: true,
                quantity: 1,
                image_url: "",
                ck_price: 0,
            },
        ];

        const matches = getMatches(searchList, repositoryList);
        expect(matches).toHaveLength(1);
        expect(matches[0].name).toBe("Alpha");
    });

    it("returns empty array when there are no name matches", () => {
        const searchList: Card[] = [
            {
                name: "Delta",
                set: "A",
                collector_number: "4",
                rarity: "Common",
                isFoil: true,
                quantity: 1,
                image_url: "",
                ck_price: 0,
            },
        ];

        const repositoryList: Card[] = [
            {
                name: "Beta",
                set: "Z",
                collector_number: "3",
                rarity: "Uncommon",
                isFoil: false,
                quantity: 1,
                image_url: "",
                ck_price: 0,
            },
        ];

        const matches = getMatches(searchList, repositoryList);
        expect(matches).toHaveLength(0);
    });
});
