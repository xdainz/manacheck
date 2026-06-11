import { describe, it, expect } from "vitest";
import { resolveFetchUrl } from "../src/lib/deckFetch";

const WORKER = "https://proxy.example.workers.dev";

describe("resolveFetchUrl", () => {
    it("routes manabox links through the Vite proxy in dev", () => {
        const { url, source } = resolveFetchUrl(
            "https://manabox.app/decks/abc123",
            { workerBase: WORKER, isDev: true },
        );
        expect(url).toBe("/api/manabox/decks/abc123");
        expect(source).toBe("manabox");
    });

    it("routes manabox links through the worker in production", () => {
        const { url } = resolveFetchUrl("https://manabox.app/decks/abc123", {
            workerBase: WORKER,
            isDev: false,
        });
        expect(url).toBe(`${WORKER}/api/manabox/decks/abc123`);
    });

    it("falls back to the direct manabox URL without a worker base", () => {
        const link = "https://manabox.app/decks/abc123";
        const { url } = resolveFetchUrl(link, {
            workerBase: "",
            isDev: false,
        });
        expect(url).toBe(link);
    });

    it("converts moxfield deck pages to the v3 API path in dev", () => {
        const { url, source } = resolveFetchUrl(
            "https://moxfield.com/decks/xyz789",
            { workerBase: WORKER, isDev: true },
        );
        expect(url).toBe("/api/moxfield/v3/decks/all/xyz789");
        expect(source).toBe("moxfield");
    });

    it("routes moxfield links through the worker in production", () => {
        const { url } = resolveFetchUrl("https://moxfield.com/decks/xyz789", {
            workerBase: WORKER,
            isDev: false,
        });
        expect(url).toBe(`${WORKER}/api/moxfield/v3/decks/all/xyz789`);
    });

    it("hits the moxfield API directly without a worker base", () => {
        const { url } = resolveFetchUrl("https://moxfield.com/decks/xyz789", {
            workerBase: "",
            isDev: false,
        });
        expect(url).toBe("https://api2.moxfield.com/v3/decks/all/xyz789");
    });

    it("throws for unsupported domains", () => {
        expect(() =>
            resolveFetchUrl("https://archidekt.com/decks/123", {
                workerBase: WORKER,
                isDev: false,
            }),
        ).toThrow("Unsupported domain");
    });

    it("throws for plain text that is not a link", () => {
        expect(() =>
            resolveFetchUrl("not a url", { workerBase: "", isDev: true }),
        ).toThrow("Unsupported domain");
    });
});
