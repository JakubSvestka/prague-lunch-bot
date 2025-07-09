import * as cheerio from "cheerio"
import {Menu, MenuItem, Scrapper} from "../types"
import axios from "../utils/axios"

const excluded = [
    'Domácí ice tea',
    'Espresso tonic',
    'Pilsner Urquell 0,3l',
]

export async function fetchFuelBistro(scrapper: Scrapper): Promise<Menu> {
    const res = await axios.get(scrapper.url)
    const $ = cheerio.load(res.data)
    const items: MenuItem[] = []

    $(".jidelak1 .polozka").each((index, el) => {
        const rawText = $(el).text().trim()

        if (excluded.some(e => rawText.includes(e))) {
            return
        }

        // Extract name and price using pattern: "Some dish name / 123,-"
        const match = rawText.match(/^(.*?)\s*\/\s*(\d+),-$/)
        if (match) {
            const name = fixCase(match[1].replace(/\s+/g, " ").trim())
            const price = parseInt(match[2], 10)
            items.push({
                name,
                price,
                isSoup: index < 3 && price < 100,
                isVegetarian: name.includes("Vegetarian")
            })
        }
    })

    if (items.length === 0) {
        throw new Error(`menu not found`)
    }

    return {
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
