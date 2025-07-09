export interface JidloviceMenu {
    available: boolean;
    branch_id: number;
    menu_date: string; // ISO date string
    is_closed: boolean;
    closed_reason: string | null;
    closed_reason_en: string | null;
    date_modified: string; // ISO timestamp
    menu_items: MenuItem[];
}

interface MenuItem {
    date_modified: string;
    branch_id: number;
    meal_id: number;
    menu_date: string;
    is_from_main_menu: boolean;
    meal_override: any; // could be null or defined type if known
    meal: Meal;
}

export interface Meal {
    name: string;
    name_en: string;
    description: string | null;
    description_en: string | null;
    price: number;
    quantity: number | null;
    allergens: number;
    draft: boolean;
    permanent: boolean;
    id: number;
    date_modified: string;
    category_id: number;
    tags: MealTag[];
}

interface MealTag {
    meal_id: number;
    tag_id: number;
    tag: TagDetail;
}

interface TagDetail {
    name: string;
    name_en: string;
    description: string;
    description_en: string;
    color: string;
    is_public: boolean;
    id: number;
}