import {Menu} from "../types";
const printMenusToConsole = (menus: Menu[]) => {
    for (const menu of menus) {
        console.log(`\n=== ${menu.icon} ${menu.name} ===`);
        console.log(`🌐 ${menu.url}`);
        console.log(`📍 ${menu.locationUrl}\n`);

        for (const item of menu.items) {
            console.log(`• ${item.name} ${item.name ? `– ${item.price}\u00A0Kč ` : ''}${item.isSoup ? '🍲':''}${item.isVegetarian ? '🌿':''}`);
            if (item.description) {
                console.log(`  ${item.description}`);
            }
        }

        console.log('\n' + '-'.repeat(40));
    }
}

export default printMenusToConsole