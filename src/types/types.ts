export interface Card {
    name: string;
    isFoil: boolean;
    set: string;
    collector_number: string;
    rarity: string;
    quantity: number;
    image_url: string;
    ck_price: number;
    special_price?: boolean;
}

export interface Store {
    name: string;
    full_name: string;
    image_banner: string;
    ck_price: number;
    website?: string;
    gSheetId: number;
}
