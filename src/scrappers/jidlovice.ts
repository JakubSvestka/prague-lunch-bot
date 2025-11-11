import {Menu, MenuItem, Scrapper} from "../types"
import dayjs from "../utils/dayjs"
import axios from "../utils/axios"
import {JidloviceMenu, Meal} from "../types/jidlovice";

const SOUP_CATEGORY_ID = 1

export async function fetchJidlovice(scrapper: Scrapper): Promise<Menu> {
    const res = await axios.get(scrapper.scrapeUrl as string)
    const menu: JidloviceMenu = res.data
    const items: MenuItem[] = []

    if (!dayjs(menu.menu_date, "YYYY-MM-DD").isToday() || menu.is_closed) {
        throw new Error(`menu not found`)
    }

    const sortedItems = menu.menu_items
        .sort((a, b) => a.is_from_main_menu ? 1 : -1)  //prioritise daily meals
        .sort((a, b) => a.meal.category_id === SOUP_CATEGORY_ID ? -1 : 1) //soups firstly

    for (const item of sortedItems) {
        items.push({
            name: `${normalize(item.meal.name)}`,
            description: item.meal.description ? normalize(item.meal.description) : null,
            price: item.meal.price,
            isVegetarian: isVegetarian(item.meal),
            isSoup: item.meal.category_id === SOUP_CATEGORY_ID
        })
    }

    return {
        id: scrapper.id,
        icon: scrapper.icon,
        name: scrapper.name,
        url: scrapper.url,
        locationUrl: scrapper.locationUrl,
        items
    }
}

const normalize = (val: string): string => val.trim().replace(/\s+/g, " ")
const isVegetarian = (meal: Meal): boolean => meal.tags.some(t => t.tag.name === "vegetarián")