import { describe, it, expect } from "vitest";
import { getMatches } from "../src/hooks/compareDecks";
import type { Card } from "../src/types/CardType";

describe("getMatches", () => {
    it("returns repository cards present in search list by Name", () => {
        const searchList: Card[] = [
            {
                Name: "Alpha",
                Set: "X",
                Collector_number: "1",
                Rarity: "Rare",
                Quantity: 1,
                image_url: "",
                ck_price: 0,
            },
            {
                Name: "Gamma",
                Set: "Y",
                Collector_number: "2",
                Rarity: "Common",
                Quantity: 2,
                image_url: "",
                ck_price: 0,
            },
        ];

        const repositoryList: Card[] = [
            {
                Name: "Alpha",
                Set: "X",
                Collector_number: "1",
                Rarity: "Rare",
                Quantity: 1,
                image_url: "",
                ck_price: 0,
            },
            {
                Name: "Beta",
                Set: "Z",
                Collector_number: "3",
                Rarity: "Uncommon",
                Quantity: 1,
                image_url: "",
                ck_price: 0,
            },
        ];

        const matches = getMatches(searchList, repositoryList);
        expect(matches).toHaveLength(1);
        expect(matches[0].Name).toBe("Alpha");
    });

    it("returns empty array when there are no name matches", () => {
        const searchList: Card[] = [
            {
                Name: "Delta",
                Set: "A",
                Collector_number: "4",
                Rarity: "Common",
                Quantity: 1,
                image_url: "",
                ck_price: 0,
            },
        ];

        const repositoryList: Card[] = [
            {
                Name: "Beta",
                Set: "Z",
                Collector_number: "3",
                Rarity: "Uncommon",
                Quantity: 1,
                image_url: "",
                ck_price: 0,
            },
        ];

        const matches = getMatches(searchList, repositoryList);
        expect(matches).toHaveLength(0);
    });
});
