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
    const results = await Promise.allSettled(
        scrappers
            .filter(scrapper => scrapper.enabled)
            .map(scrapper => scrapper.load(scrapper))
    )

    return results
        .filter(res => res.status === 'fulfilled')
        .map(res => res.value)
}

export {
    fetchMenus
}