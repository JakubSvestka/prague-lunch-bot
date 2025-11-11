import * as cheerio from "cheerio"
import dayjs from "../utils/dayjs"
import {Menu, MenuItem, Scrapper} from "../types"
import axios from "../utils/axios"

export async function fetchPivokarlin(scrapper: Scrapper): Promise<Menu> {
    const res = await axios.get(`https://menu-bot-proxy.svestka1999.workers.dev/?url=${scrapper.url}`)
    const $ = cheerio.load(res.data)

    // Find all day columns
    const dayBlocks = $("#tab-poledni-nabidka .vc_col-sm-6")
    const todayRegex = new RegExp(`\\b${dayjs().format("D\\.[\\s*]")}`, "i")
    const items: MenuItem[] = []

    dayBlocks.each((_, el) => {
        const dateText = $(el).find("h5").text().trim().replace(/\s+/g, " ")
        if (!todayRegex.test(dateText)) {
            return
        }

        $(el)
            .find(".nectar_food_menu_item")
            .each((index, itemEl) => {
                const fullName = $(itemEl).find(".item_name h4").text().trim()
                const name = fullName
                    .replace("/\*/g", "")
                    .replace(/\s[0-9]{1,2}[a-z]?([,][0-9]{1,2}[a-z]?)*$/, "")
                    .replace(/\d+(g|(ks))/, "")
                    .replace(/VEG\s+/, "")
                    .trim()
                const priceText = $(itemEl).find(".item_price h4").text().trim().replace(",-", "").trim()
                const price = parseInt(priceText, 10)

                if (name) {
                    items.push({
                        name,
                        price,
                        isSoup: index === 0 && price < 100,
                        isVegetarian: fullName.includes("VEG ")
                    })
                }
            })
    })

    if (!items.length) {
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
