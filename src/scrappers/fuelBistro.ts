import * as cheerio from "cheerio"
import {Menu, MenuItem, Scrapper} from "../types"
import axios from "../utils/axios"
import normalize from "../utils/normalize"

export async function fetchFuelBistro(scrapper: Scrapper): Promise<Menu> {
    const res = await axios.get(scrapper.scrapeUrl ?? scrapper.url)
    const $ = cheerio.load(res.data)
    const items: MenuItem[] = []

    $("span:contains('TÝDENNÍ MENU')")
        .closest("div.accordion")
        .find("div.block.block-listitem")
        .each((index, el) => {
            const name = normalize(
                $(el)
                    .find(".listitem-cell")
                    .first()
                    .text()
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
        icon_name: scrapper.icon_name,
        name: scrapper.name,
        url: scrapper.url,
        locationUrl: scrapper.locationUrl,
        coordinates: scrapper.coordinates,
        items
    }
}
