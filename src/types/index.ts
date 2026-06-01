export type Coordinates = {
    lat: number;
    lng: number;
};

export type Scrapper = {
    id: string,
    disabled?: boolean;
    icon: string;
    icon_name: string;
    name: string;
    url: string;
    scrapeUrl?: string;
    locationUrl: string;
    coordinates: Coordinates;
    load?: (scrapper: Scrapper) => Promise<Menu>;
};

export type Menu = {
    id: string;
    icon: string;
    icon_name: string;
    name: string;
    url: string;
    locationUrl: string;
    coordinates: Coordinates;
    items: MenuItem[];
};

export type MenuItem = {
    name: string;
    description?: string|null;
    price: number|null;
    isVegetarian?: boolean;
    isSoup?: boolean;
    hideInPresentation?: boolean;
};