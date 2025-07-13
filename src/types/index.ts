export type Scrapper = {
    disabled?: boolean;
    icon: string;
    name: string;
    url: string;
    scrapeUrl?: string;
    locationUrl: string;
    load: (scrapper: Scrapper) => Promise<Menu>;
};

export type Menu = {
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