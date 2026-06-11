export type Language = "en" | "es";

const en = {
    "nav.home": "Home",
    "footer.developedBy": "was developed by",
    "comparator.title": "Decklist Comparator",
    "comparator.searchLabel": "Search Link:",
    "comparator.repositoryLabel": "Repository Link:",
    "comparator.searchPlaceholder": "List you are looking for...",
    "comparator.repositoryPlaceholder": "List to filter through...",
    "comparator.clearSearch": "Clear search link",
    "comparator.clearRepository": "Clear repository link",
    "comparator.submit": "Compare",
    "common.error": "Error:",
    "common.supportedSites": "Supported sites:\n- Manabox\n- Moxfield",
    "store.title": "Search in {store}'s stock",
    "store.placeholder": "Paste here your manabox/moxfield link.",
    "store.clearLink": "Clear deck link",
    "store.inputLabel": "Deck link",
    "store.submit": "Search",
    "store.fetching": "Fetching decklists",
    "store.progress": "{current}/{total} decklists fetched",
    "store.starting": "Starting...",
    "store.helper":
        "Store data automatically updates every hour + whatever it takes for Moxfield's API to update, if you want to update manually click",
    "store.helperHere": "here.",
    "store.lastUpdated": "(Last updated at: {date})",
    "store.never": "Never",
    "store.notFound": "Store not found.",
    "result.title": "Search Results",
    "result.cardsFound": "Cards Found:",
    "result.totalPrice": "Total Price:",
    "export.copy": "Copy to clipboard",
    "export.copying": "Copying…",
    "export.copied": "Copied!",
    "card.set": "Set:",
    "card.number": "Number:",
    "card.rarity": "Rarity:",
    "card.quantity": "Quantity:",
    "card.noPrice": "Pricing Unavailable",
    "card.specialPriceHint":
        "This card might be priced differently, ask the seller.",
    "grid.noMatches": "No matches found :^(",
    "notFound.title": "Page not found.",
    "notFound.goPrefix": "Go ",
    "notFound.goLink": "back",
    "notFound.goSuffix": " to the homepage.",
};

export type TranslationKey = keyof typeof en;

const es: Record<TranslationKey, string> = {
    "nav.home": "Inicio",
    "footer.developedBy": "fue desarrollado por",
    "comparator.title": "Comparador de Decklists",
    "comparator.searchLabel": "Enlace de búsqueda:",
    "comparator.repositoryLabel": "Enlace del repositorio:",
    "comparator.searchPlaceholder": "Lista que estás buscando...",
    "comparator.repositoryPlaceholder": "Lista para filtrar...",
    "comparator.clearSearch": "Borrar enlace de búsqueda",
    "comparator.clearRepository": "Borrar enlace del repositorio",
    "comparator.submit": "Comparar",
    "common.error": "Error:",
    "common.supportedSites": "Sitios compatibles:\n- Manabox\n- Moxfield",
    "store.title": "Busca en el stock de {store}",
    "store.placeholder": "Pega aquí tu enlace de manabox/moxfield.",
    "store.clearLink": "Borrar enlace del mazo",
    "store.inputLabel": "Enlace del mazo",
    "store.submit": "Buscar",
    "store.fetching": "Obteniendo decklists",
    "store.progress": "{current}/{total} decklists obtenidas",
    "store.starting": "Comenzando...",
    "store.helper":
        "Los datos de la tienda se actualizan automáticamente cada hora + lo que tarde la API de Moxfield en actualizarse, si quieres actualizar manualmente haz clic",
    "store.helperHere": "aquí.",
    "store.lastUpdated": "(Última actualización: {date})",
    "store.never": "Nunca",
    "store.notFound": "Tienda no encontrada.",
    "result.title": "Resultados de búsqueda",
    "result.cardsFound": "Cartas encontradas:",
    "result.totalPrice": "Precio total:",
    "export.copy": "Copiar al portapapeles",
    "export.copying": "Copiando…",
    "export.copied": "¡Copiado!",
    "card.set": "Edición:",
    "card.number": "Número:",
    "card.rarity": "Rareza:",
    "card.quantity": "Cantidad:",
    "card.noPrice": "Precio no disponible",
    "card.specialPriceHint":
        "Esta carta podría tener un precio diferente, pregunta al vendedor.",
    "grid.noMatches": "No se encontraron coincidencias :^(",
    "notFound.title": "Página no encontrada.",
    "notFound.goPrefix": "",
    "notFound.goLink": "Volver",
    "notFound.goSuffix": " a la página de inicio.",
};

export const translations: Record<Language, Record<TranslationKey, string>> = {
    en,
    es,
};

export function translate(
    language: Language,
    key: TranslationKey,
    params?: Record<string, string | number>,
): string {
    const template = translations[language][key];
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in params ? String(params[name]) : match,
    );
}
