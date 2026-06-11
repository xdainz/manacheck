// @vitest-environment jsdom

import { describe, it, expect, vi, afterEach } from "vitest";
import { exportList } from "../src/lib/export";
import type { Card } from "../src/types/types";

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

function setClipboard(value: unknown) {
    Object.defineProperty(navigator, "clipboard", {
        value,
        configurable: true,
    });
}

function removeClipboard() {
    delete (navigator as { clipboard?: unknown }).clipboard;
}

describe("exportList", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        removeClipboard();
    });

    it("uses navigator.clipboard.writeText when available and returns the formatted string", async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        setClipboard({ writeText });

        const out = await exportList(sample);
        expect(writeText).toHaveBeenCalledWith(expectedOutput);
        expect(out).toBe(expectedOutput);
    });

    it("falls back to document.execCommand when navigator.clipboard is not available", async () => {
        removeClipboard();

        // jsdom does not implement execCommand; define it so it can be spied on
        if (!document.execCommand) {
            Object.defineProperty(document, "execCommand", {
                value: () => false,
                configurable: true,
                writable: true,
            });
        }

        const execSpy = vi
            .spyOn(document, "execCommand")
            .mockImplementation(() => true);

        const out = await exportList(sample);
        expect(execSpy).toHaveBeenCalledWith("copy");
        expect(out).toBe(expectedOutput);
    });
});
