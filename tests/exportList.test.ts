// @vitest-environment jsdom

import { describe, it, expect, vi, afterEach } from "vitest";
import { exportList } from "../src/hooks/compareDecks";
import type { Card } from "../src/types/CardType";

const sample: Card[] = [
    {
        Name: "Emmara, Soul of the Accord",
        Set: "GRN",
        Collector_number: "168",
        Rarity: "Rare",
        Quantity: 1,
        image_url: "",
        ck_price: 0,
    },
    {
        Name: "Alpha",
        Set: "X",
        Collector_number: "1",
        Rarity: "Common",
        Quantity: 2,
        image_url: "",
        ck_price: 0,
    },
];

const expectedOutput = `1 Emmara, Soul of the Accord (GRN) 168\n2 Alpha (X) 1`;

describe("exportList", () => {
    afterEach(() => {
        // cleanup any global mocks
        vi.restoreAllMocks();
        // remove navigator.clipboard if we injected it
        try {
            // @ts-ignore
            if ((navigator as any).clipboard)
                delete (navigator as any).clipboard;
        } catch (e) {
            // ignore
        }
    });

    it("uses navigator.clipboard.writeText when available and returns the formatted string", async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        // attach fake clipboard on existing navigator
        // @ts-ignore
        (navigator as any).clipboard = { writeText };

        const out = await exportList(sample);
        expect(writeText).toHaveBeenCalledWith(expectedOutput);
        expect(out).toBe(expectedOutput);
    });

    it("falls back to document.execCommand when navigator.clipboard is not available", async () => {
        // remove clipboard from navigator if present
        // @ts-ignore
        if ((navigator as any).clipboard) delete (navigator as any).clipboard;

        // ensure execCommand exists on document
        if (!(document as any).execCommand) {
            // @ts-ignore
            (document as any).execCommand = () => false;
        }

        const execSpy = vi
            .spyOn(document as any, "execCommand")
            .mockImplementation(() => true);

        const out = await exportList(sample);
        expect(execSpy).toHaveBeenCalledWith("copy");
        expect(out).toBe(expectedOutput);

        execSpy.mockRestore();
    });
});
