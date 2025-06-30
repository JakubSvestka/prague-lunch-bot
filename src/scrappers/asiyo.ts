import * as cheerio from "cheerio";
import {Menu, MenuItem, Scrapper} from "../types";
import dayjs from "../utils/dayjs";
import axios from "../utils/axios";

export async function fetchAsiyo(scrapper: Scrapper): Promise<Menu> {
    const res = await axios.get(scrapper.url);
    const $ = cheerio.load(res.data);
    const items: MenuItem[] = [];
    const weeklyItems: MenuItem[] = [];

    const lines: string[] = $('.b-c.b-text-c.b-s.b-s-t60.b-s-b60.b-cs.cf')
        .find('h1, h2, h3, p')
        .map((_, el) => $(el).text()
            .trim()
        )
        .get()
        .filter(line => line !== '')

    let mode: 'none' | 'week' | 'daily' = 'none';
    let i = 0;
    const dayName = dayjs().format('dddd')

    while (i < lines.length) {
        const line = lines[i].trim();

        if (line === 'CELOTÝDENNÍ NABÍDKA') {
            mode = 'week';
            i++;
            continue;
        }

        if (line === 'DENNÍ NABÍDKA') {
            mode = 'daily';
            i++;
            continue;
        }

        if (mode === "week") {
            const match = line.match(new RegExp(`^\\s*(.+?)\\s+(\\d+,-)`, 'i'))
            if (match) {
                const [, name, price] = match

                weeklyItems.push({ name: name, price: parseInt(price), description: lines[++i] });
            }
        }

        const dayMatch = line.match(new RegExp(`^${dayName}:\\s*(.+?)\\s+(\\d+,-)`, 'i'));

        if (mode === "daily" && dayMatch) {
            const [, name, price] = dayMatch;
            items.push({ name, price: parseInt(price), description: lines[++i] });
        }

        i++;
    }

    if (items.length === 0 && weeklyItems.length === 0) {
        throw new Error(`menu not found`)
    }

    return {
        name: scrapper.name,
        url: scrapper.url,
        locationUrl: scrapper.locationUrl,
        items: [
            ...items,
            ...weeklyItems
        ]
    };
}
