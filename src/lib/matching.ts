import type { Card } from "../types/types";

export function getMatches(searchList: Card[], repositoryList: Card[]) {
    const searchNameSet = new Set<string>(searchList.map((card) => card.name));

    const matches: Card[] = [];
    for (const card of repositoryList) {
        if (searchNameSet.has(card.name)) {
            matches.push(card);
        }
    }

    return matches.sort((a, b) => a.name.localeCompare(b.name));
}
