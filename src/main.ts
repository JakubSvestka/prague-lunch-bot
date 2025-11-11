import dotenv from "dotenv"
import minimist from "minimist"
import {send} from "./utils/slack";
import {fetchMenus} from "./scrappers";
import printMenusToConsole from "./utils/menuPrint";
import generatePage from "./utils/menuPage";

const env = process.env.NODE_ENV || 'development'
dotenv.config({ path: `.env.${env}` })

const args = minimist(process.argv.slice(2))

async function main() {
    const menus = await fetchMenus()
    menus.forEach((menu) => console.info(`✅ ${menu.name}: loaded ${menu.items.length} items.`))

    if ('generate-page' in args) {
        const result = await generatePage(menus)

        result || process.exit(1)
    }

    if ('post-message' in args) {
        const result = await send(menus)

        result || process.exit(1)
    }

    if ('console' in args) {
        printMenusToConsole(menus)
    }

    process.exit(0)
}

main().catch((err) => {
    console.error("❌ Unexpected error:", err)
    process.exit(1)
})
