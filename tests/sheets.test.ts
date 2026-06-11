import { describe, it, expect } from "vitest";
import { parseCsv } from "../src/lib/sheets";

describe("parseCsv", () => {
    it("parses a simple header + rows", () => {
        const csv = "NAME,URL\nDeck A,https://moxfield.com/decks/abc\nDeck B,https://manabox.app/decks/def";
        const rows = parseCsv(csv);
        expect(rows).toHaveLength(2);
        expect(rows[0]).toEqual({
            NAME: "Deck A",
            URL: "https://moxfield.com/decks/abc",
        });
        expect(rows[1].NAME).toBe("Deck B");
    });

    it("handles quoted fields containing commas", () => {
        const csv = 'NAME,URL\n"Esper, Control",https://moxfield.com/decks/abc';
        const rows = parseCsv(csv);
        expect(rows[0].NAME).toBe("Esper, Control");
        expect(rows[0].URL).toBe("https://moxfield.com/decks/abc");
    });

    it("handles escaped double quotes inside quoted fields", () => {
        const csv = 'NAME,URL\n"The ""Best"" Deck",https://moxfield.com/decks/abc';
        const rows = parseCsv(csv);
        expect(rows[0].NAME).toBe('The "Best" Deck');
    });

    it("handles CRLF line endings", () => {
        const csv = "NAME,URL\r\nDeck A,https://moxfield.com/decks/abc\r\n";
        const rows = parseCsv(csv);
        expect(rows).toHaveLength(1);
        expect(rows[0].URL).toBe("https://moxfield.com/decks/abc");
    });

    it("fills missing columns with empty strings", () => {
        const csv = "NAME,URL\nOnly a name";
        const rows = parseCsv(csv);
        expect(rows[0]).toEqual({ NAME: "Only a name", URL: "" });
    });

    it("ignores extra columns and keeps NAME/URL by header", () => {
        const csv = "URL,NAME,NOTES\nhttps://moxfield.com/decks/abc,Deck A,hi";
        const rows = parseCsv(csv);
        expect(rows[0]).toEqual({
            NAME: "Deck A",
            URL: "https://moxfield.com/decks/abc",
        });
    });

    it("returns no rows for a header-only sheet", () => {
        expect(parseCsv("NAME,URL")).toHaveLength(0);
    });
});
