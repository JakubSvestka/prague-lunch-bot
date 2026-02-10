import {Menu, Scrapper} from "../types";
import {fetchPivokarlin} from "./pivokarlin";
import {fetchAsiyo} from "./asiyo";
import {fetchDvorekKarlin} from "./dvorekKarlin";
import {fetchFuelBistro} from "./fuelBistro";
import {fetchMenicka} from "./menicka";
import {fetchJidlovice} from "./jidlovice";
import dayjs from "../utils/dayjs";

const scrappers: Scrapper[] = [
    {
        id: "asiyo",
        icon: "sushi",
        name: "🍣 Asiyo",
        url: "https://www.asiyo.cz/poledni-menu/",
        locationUrl: "https://maps.app.goo.gl/2yzue2EHDx8SSYCa9",
        load: fetchAsiyo,
        disabled: true,
    },
    {
        id: "diego_pivni_bar",
        icon: "dart",
        name: "🎯 Diego pivní bar",
        url: "http://www.diegopivnibar.cz/cz/",
        scrapeUrl: "https://www.menicka.cz/7191-diego-pivni-bar.html",
        locationUrl: "https://maps.app.goo.gl/WaBWra3W2ebzZ73p8",
        load: fetchMenicka,
    },
    {
        id: "dvorek_karlin",
        icon: "house_with_garden",
        name: "🏡 Dvorek Karlín",
        url: "https://www.dvorekkarlin.com/denni-nabidka/",
        locationUrl: "https://maps.app.goo.gl/kivSxE9iMU6rgQj78",
        load: fetchDvorekKarlin,
    },
    {
        id: "fuel_bistro",
        icon: "coffee",
        name: "☕️ Fuel Bistro",
        url: "https://fuelbistro.cz/",
        scrapeUrl: "https://www.fuelbistro.cz/menu",
        locationUrl: "https://maps.app.goo.gl/DhmZ42BbGxaiRXW68",
        load: fetchFuelBistro,
    },
    {
        id: "gastro_karlin",
        icon: "curry",
        name: "🍛 Gastro Karlín",
        url: "https://www.gastrokarlin.cz/",
        scrapeUrl: "https://www.menicka.cz/4323-gastro-karlin.html",
        locationUrl: "https://maps.app.goo.gl/Hn9WyxNiLziTtHS37",
        load: fetchMenicka,
    },
    {
        id: "jidlovice",
        icon: "knife_fork_plate",
        name: "🍽️ Jídlovice",
        url: "https://www.jidlovice.cz/karlin/",
        scrapeUrl: `https://www.jidlovice.cz/api/v1/branch/2/menu/${dayjs().format('YYYY-MM-DD')}?include_internal_tags=false`,
        locationUrl: "https://maps.app.goo.gl/fK3T5j2mh5XpfGQS9",
        load: fetchJidlovice,
    },
    {
        id: "peters_pub",
        icon: "burger",
        name: "🍔 Peter's pub",
        url: "http://www.peterspub.cz/",
        scrapeUrl: "https://www.menicka.cz/4230-peters-pub.html",
        locationUrl: "https://maps.app.goo.gl/b6dyMJXK1q8VEG897",
        load: fetchMenicka,
    },
    {
        id: "pivo_karlin",
        icon: "beer",
        name: "🍺 Pivo Karlín",
        url: "https://www.pivokarlin.cz/",
        locationUrl: "https://maps.app.goo.gl/iWD3jubpzKhbMRFk8",
        load: fetchPivokarlin,
    },
]

const fetchMenus = async (scrapperId?: string): Promise<Menu[]> => {
    const enabledScrappers = scrappers
        .filter((scrapper) => !scrapperId || scrapper.id === scrapperId)
        .filter(scrapper => !scrapper.disabled);

    const results = await Promise.allSettled(
        enabledScrappers.map(scrapper => scrapper.load(scrapper))
    );

    results.forEach((res, i) => {
        if (res.status === 'rejected') {
            const scrapper = enabledScrappers[i];
            console.warn(`❌ Scraper ${scrapper.name} failed:`, res.reason?.message || res.reason);
        }
    });

    return results
        .filter((res): res is PromiseFulfilledResult<Menu> => res.status === 'fulfilled')
        .map(res => res.value);
}

export {
    fetchMenus
}