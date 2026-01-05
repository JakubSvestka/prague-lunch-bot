import * as cheerio from "cheerio"
import {Menu, MenuItem, Scrapper} from "../types"
import axios from "../utils/axios"

export async function fetchFuelBistro(scrapper: Scrapper): Promise<Menu> {
    const res = await axios.get(scrapper.scrapeUrl ?? scrapper.url)
    const $ = cheerio.load(res.data)
    const items: MenuItem[] = []

    $("span:contains('TÝDENNÍ MENU')")
        .closest("div.accordion")
        .find("div.block.block-listitem")
        .each((index, el) => {
            const name = fixCase(
                $(el)
                    .find(".listitem-cell")
                    .first()
                    .text()
                    .replace(/\s+/g, " ")
                    .trim()
            )

            const priceText = $(el)
                .find(".listitem-cell")
                .last()
                .text()
                .trim()

            const priceMatch = priceText.match(/(\d+),-/)
            if (!priceMatch || !name) {
                return
            }

            const price = parseInt(priceMatch[1], 10)

            items.push({
                name,
                price,
                isSoup: price < 100,
                isVegetarian: /vegetari|vegan/i.test(name)
            })
    })

    if (items.length === 0) {
        throw new Error(`menu not found`)
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

function fixCase(str: string): string {
    const lower = str.toLowerCase().trim()
    return lower.charAt(0).toUpperCase() + lower.slice(1)
}
