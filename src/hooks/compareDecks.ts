import type { Card } from "../types/CardType";

export function getMatches(searchList: Card[], repositoryList: Card[]) {
    const searchNameSet = new Set<string>(searchList.map((card) => card.Name));

    const matches: Card[] = [];
    for (const card of repositoryList) {
        if (searchNameSet.has(card.Name)) {
            matches.push(card);
        }
    }

    return matches;
}

export async function exportList(list: Card[]): Promise<string> {
    // Build lines in the format: Quantity Name (Set) Collector_number
    const lines = list.map(
        (c) => `${c.Quantity} ${c.Name} (${c.Set}) ${c.Collector_number}`
    );

    const output = lines.join("\n");

    // Try navigator.clipboard first (async, secure context)
    try {
        if (
            typeof navigator !== "undefined" &&
            navigator.clipboard &&
            navigator.clipboard.writeText
        ) {
            await navigator.clipboard.writeText(output);
            return output;
        }
    } catch (e) {
        // ignore and fall back to execCommand
    }

    // Fallback: create a hidden textarea, select, and execCommand('copy')
    try {
        if (typeof document !== "undefined") {
            const ta = document.createElement("textarea");
            ta.value = output;
            ta.setAttribute("readonly", "");
            ta.style.position = "absolute";
            ta.style.left = "-9999px";
            document.body.appendChild(ta);
            ta.select();
            // For iOS
            ta.setSelectionRange(0, ta.value.length);
            document.execCommand("copy");
            document.body.removeChild(ta);
        }
    } catch (e) {
        // ignore copy failures
    }

    return output;
}
