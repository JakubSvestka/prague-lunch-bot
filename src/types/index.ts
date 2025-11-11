export type Scrapper = {
    id: string,
    disabled?: boolean;
    icon: string;
    name: string;
    url: string;
    scrapeUrl?: string;
    locationUrl: string;
    load: (scrapper: Scrapper) => Promise<Menu>;
};

export type Menu = {
    id: string;
    icon: string;
    name: string;
    url: string;
    locationUrl: string;
    items: MenuItem[];
};

export type MenuItem = {
    name: string;
    description?: string|null;
    price: number|null;
    isVegetarian?: boolean;
    isSoup?: boolean;
};