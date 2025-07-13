import * as cheerio from "cheerio"
import {Menu, MenuItem, Scrapper} from "../types"
import dayjs from "../utils/dayjs"
import axios from "../utils/axios"

export async function fetchDvorekKarlin(scrapper: Scrapper): Promise<Menu> {
    const res = await axios.get(scrapper.url)
    const $ = cheerio.load(res.data)
    const items: MenuItem[] = []

    const date = $('.et_pb_section_3 .et_pb_row_3 p').text()

    if (!dayjs(date, "DD.MM.YYYY").isToday()) {
        throw new Error(`menu not found`)
    }

    const paragraphs = $('.et_pb_section_3 .et_pb_row_4 p')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(line => line.length > 0)

    let buffer: string[] = []
    const ignoredParagraphs = ['Polévky', 'Hlavní jídla', 'TÝDENNÍ SPECIÁLY']
    let isSoup = false

    for (const line of paragraphs) {
        if (ignoredParagraphs.includes(line)) {
            isSoup = line === 'Polévky'

            continue
        }

        if (line.match(/^\d+,-$/)) {
            const {name, description} = parse(buffer.join("/"))
            const price = parseInt(line.replace(',-', ''), 10)
            items.push({ name, price, description, isSoup })
            buffer = []
        } else {
            buffer.push(line)
        }
    }

    return {
        icon: scrapper.icon,
        name: scrapper.name,
        url: scrapper.url,
        locationUrl: scrapper.locationUrl,
        items
    }
}

function parse(line: string): {name: string, description?: string}
{
    const normalizeName = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

    // Option 1: if slash exists, name is before slash, description after
    if (line.includes('/')) {
        const [name, ...descParts] = line.split('/')
        const description = descParts.join('/').trim().replaceAll('/', ', ')
        return { name: normalizeName(name.trim()), description }
    }

    // Option 2: if no slash, split on first space (if name is uppercase words)
    const nameMatch = line.match(/^(.+)\s*\/\s*(.*)$/i)
    if (nameMatch) {
        const name = normalizeName(nameMatch[1].trim())
        const description = nameMatch[2].trim().replaceAll('/', ', ')
        return { name, description }
    }

    // fallback: whole line is name, no description
    return { name: normalizeName(line.trim()) }
}
