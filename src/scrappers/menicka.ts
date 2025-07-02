import * as cheerio from "cheerio"
import {Menu, MenuItem, Scrapper} from "../types"
import dayjs from "../utils/dayjs"
import axios from "../utils/axios"
import iconv from "iconv-lite"

export async function fetchMenicka(scrapper: Scrapper): Promise<Menu> {
    const res = await axios.get(
        scrapper.scrapeUrl as string,
        {
            responseType: 'arraybuffer', // because of windows-1250
        }
    )
    const decoded = iconv.decode(Buffer.from(res.data), "windows-1250")
    const $ = cheerio.load(decoded)

    const items: MenuItem[] = []

    const todayRegex = new RegExp(`\\b${dayjs().format("D\\.M\\.YYYY")}\\b`)

    // Find the correct menu block
    const dayBlock = $(".menicka").filter((_, el) => {
        const heading = $(el).find(".nadpis").text().trim()
        return todayRegex.test(heading)
    }).first()

    if (!dayBlock.length) {
        throw new Error(`menu not found`)
    }


    // Soups
    dayBlock.find(".polevka").each((_, el) => {
        if ($(el).text() === "Pro tento den nebylo zadáno menu.") {
            return
        }

        const name = $(el).find(".polozka").text()

        const priceText = $(el).find(".cena").text().replace(/\s*Kč|,-/g, "").trim()
        const price = parseInt(priceText, 10)

        items.push({ name: name, price: isNaN(price) ? 0 : price })
    })

    // Main meals
    dayBlock.find(".jidlo").each((_, el) => {
        // 1. 150g peper smash beef burger of the day
        // 3. Teriyaki veal poké bowl
        // Beer and bacon ribs tacos - tři kukuřičné tortilly plněné trhaným vepřovým masem z žeber pečených na pivu a slanině s nakládanou červenou cibulí, podá...
        const nameRegex = new RegExp(`\\d+\\.\\s*(\\d+g)?\\s*(?<name>[^\-]+)(\\s*-\\s*(?<description>.+))?`)
        const match = ($(el).find(".polozka").text() as string).match(nameRegex)

        if (!match) {
            return
        }

        const priceText = $(el).find(".cena").text().replace(/\s*Kč|,-/g, "").trim()
        const price = parseInt(priceText, 10)

        if (match.groups?.name) {
            items.push({ name: match.groups?.name, price, description: match.groups?.description })
        }
    })

    if (!items.length) {
        throw new Error(`menu not found`)
    }

    return {
        name: scrapper.name,
        url: scrapper.url,
        locationUrl: scrapper.locationUrl,
        items
    }
}
