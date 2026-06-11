import { describe, expect, it } from "vitest";
import { translate, translations } from "../src/lib/translations";

describe("translations", () => {
    it("has the same keys in every language", () => {
        const enKeys = Object.keys(translations.en).sort();
        const esKeys = Object.keys(translations.es).sort();
        expect(esKeys).toEqual(enKeys);
    });

    it("returns the plain string for a key without params", () => {
        expect(translate("en", "comparator.submit")).toBe("Compare");
        expect(translate("es", "comparator.submit")).toBe("Comparar");
    });

    it("interpolates params into placeholders", () => {
        expect(translate("en", "store.title", { store: "Foo" })).toBe(
            "Search in Foo's stock",
        );
        expect(
            translate("es", "store.progress", { current: 2, total: 5 }),
        ).toBe("2/5 decklists obtenidas");
    });

    it("leaves unknown placeholders untouched", () => {
        expect(translate("en", "store.title", { other: "x" })).toBe(
            "Search in {store}'s stock",
        );
    });
});
