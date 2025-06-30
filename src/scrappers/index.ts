import {Menu, Scrapper} from "../types";
import {fetchPivokarlin} from "./pivokarlin";
import {fetchAsiyo} from "./asiyo";
import {fetchDvorekKarlin} from "./dvorekKarlin";
import {fetchFuelBistro} from "./fuelBistro";

const scrappers: Scrapper[] = [
    {
        enabled: true,
        name: "🍣 Asiyo",
        url: "https://www.asiyo.cz/poledni-menu/",
        locationUrl: "https://maps.app.goo.gl/2yzue2EHDx8SSYCa9",
        load: fetchAsiyo,
    },
    {
        enabled: true,
        name: "🏡 Dvorek Karlín",
        url: "https://www.dvorekkarlin.com/denni-nabidka/",
        locationUrl: "https://maps.app.goo.gl/kivSxE9iMU6rgQj78",
        load: fetchDvorekKarlin,
    },
    {
        enabled: true,
        name: "☕️ Fuel Bistro",
        url: "https://fuelbistro.cz/",
        locationUrl: "https://maps.app.goo.gl/DhmZ42BbGxaiRXW68",
        load: fetchFuelBistro,
    },
    {
        enabled: true,
        name: "🍺 Pivo Karlín",
        url: "https://www.pivokarlin.cz/",
        locationUrl: "https://maps.app.goo.gl/iWD3jubpzKhbMRFk8",
        load: fetchPivokarlin,
    },
]

const fetchMenus = async (): Promise<Menu[]> => {
    const enabledScrappers = scrappers.filter(scrapper => scrapper.enabled);

    const results = await Promise.allSettled(
        enabledScrappers.map(scrapper => scrapper.load(scrapper))
    );

    const failures: string[] = [];

    results.forEach((res, i) => {
        if (res.status === 'rejected') {
            const scrapper = enabledScrappers[i];
            console.error(`❌ Scraper ${scrapper.name} failed:`, res.reason);
            failures.push(scrapper.name);
        }
    });

    if (failures.length > 0) {
        throw new Error(`One or more scrapers failed: ${failures.join(', ')}`);
    }

    return results
        .filter((res): res is PromiseFulfilledResult<Menu> => res.status === 'fulfilled')
        .map(res => res.value);
}

export {
    fetchMenus
}