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
