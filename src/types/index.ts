export type Scrapper = {
    enabled: boolean;
    name: string;
    url: string;
    locationUrl: string;
    load: (scrapper: Scrapper) => Promise<Menu>;
};

export type Menu = {
    name: string;
    url: string;
    locationUrl: string;
    items: MenuItem[];
};

export type MenuItem = {
    name: string;
    description?: string;
    price: number;
};