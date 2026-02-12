import * as cheerio from "cheerio"
import {Menu, MenuItem, Scrapper} from "../types"
import dayjs from "../utils/dayjs"
import axios from "../utils/axios"

export async function fetchProtiProudu(scrapper: Scrapper): Promise<Menu> {
    const res = await axios.get(scrapper.scrapeUrl as string)
    const $ = cheerio.load(res.data)

    const items: MenuItem[] = []

    $('.container h2:contains("POLÉVKA A JÍDLO DNE")')
        .parent()
        .find('> div > div')
        .each((_, dayBlock) => {

            const dateText = $(dayBlock).find('p.font-bold').text().trim()
            if (!dateText) return

            // example: "pondělí 9.února"
            const dateMatch = dateText.match(/(\d+)\.\s*([^\s]+)/)
            if (!dateMatch) {
                return
            }

            if (!dateText.includes(dayjs().format('D') + '.')) {
                return
            }

            const mealParagraph = $(dayBlock).find('p.text-xl')

            mealParagraph.contents().each((index, node) => {
                if (node.type === 'text') {
                    const name = $(node).text().trim()
                    if (!name) return

                    const priceNode = $(node).next('span')
                    if (!priceNode.length) return

                    const priceText = priceNode.text().trim()
                    const price = parseInt(priceText.replace(',-', ''), 10)
                    const isSoup = index === 0

                    items.push({
                        name: normalizeName(name),
                        price,
                        isSoup
                    })
                }
            })
        })

    if (!items.length) {
        throw new Error('menu not found')
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

function normalizeName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}
