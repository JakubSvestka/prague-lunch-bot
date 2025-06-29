import dotenv from "dotenv"
import minimist from "minimist"
import {send} from "./utils/slack";
import {fetchMenus} from "./scrappers";
import {Menu} from "./types";
import printMenusToConsole from "./utils/menuPrint";

const env = process.env.NODE_ENV || 'development'
dotenv.config({ path: `.env.${env}` })

const args = minimist(process.argv.slice(2))

async function main() {
    const menus = await fetchMenus()

    if ('post-message' in args) {
        menus.forEach((menu) => console.info(`✅ ${menu.name}: loaded ${menu.items.length} items.`))
        const result = await send(menus)
        process.exit(result ? 0 : 1)
    } else {
        printMenusToConsole(menus)
    }

    process.exit(0)
}

main().catch((err) => {
    console.error("❌ Unexpected error:", err)
    process.exit(1)
})
