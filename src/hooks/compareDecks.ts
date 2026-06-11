import type { Card } from "../types/types";

export function getMatches(searchList: Card[], repositoryList: Card[]) {
    const searchNameSet = new Set<string>(searchList.map((card) => card.Name));

    const matches: Card[] = [];
    for (const card of repositoryList) {
        if (searchNameSet.has(card.Name)) {
            matches.push(card);
        }
    }

    return matches.sort((a, b) => a.Name.localeCompare(b.Name));
}

export type ExportGroup = {
    title: string;
    cards: Card[];
};

function formatList(list: Card[]): string[] {
    return list.map(
        (c) => `${c.Quantity} ${c.Name} (${c.Set}) ${c.Collector_number}`,
    );
}

async function copyOutput(output: string): Promise<void> {
    // Try navigator.clipboard first (async, secure context)
    try {
        if (
            typeof navigator !== "undefined" &&
            navigator.clipboard &&
            navigator.clipboard.writeText
        ) {
            await navigator.clipboard.writeText(output);
            return;
        }
    } catch {
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
    } catch {
        // ignore copy failures
    }
}

export async function exportList(list: Card[]): Promise<string> {
    const output = formatList(list).join("\n");
    await copyOutput(output);
    return output;
}

export async function exportGroupedList(
    groups: ExportGroup[],
): Promise<string> {
    const output = groups
        .map((group) => {
            const lines = formatList(group.cards);
            return [group.title, ...lines].join("\n");
        })
        .join("\n\n");

    await copyOutput(output);

    return output;
}
