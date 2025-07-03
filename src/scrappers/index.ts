import {Menu, Scrapper} from "../types";
import {fetchPivokarlin} from "./pivokarlin";
import {fetchAsiyo} from "./asiyo";
import {fetchDvorekKarlin} from "./dvorekKarlin";
import {fetchFuelBistro} from "./fuelBistro";
import {fetchMenicka} from "./menicka";

const scrappers: Scrapper[] = [
    {
        name: "🍣 Asiyo",
        url: "https://www.asiyo.cz/poledni-menu/",
        locationUrl: "https://maps.app.goo.gl/2yzue2EHDx8SSYCa9",
        load: fetchAsiyo,
    },
    {
        name: "🎯 Diego pivní bar",
        url: "http://www.diegopivnibar.cz/cz/",
        scrapeUrl: "https://www.menicka.cz/7191-diego-pivni-bar.html",
        locationUrl: "https://maps.app.goo.gl/WaBWra3W2ebzZ73p8",
        load: fetchMenicka,
    },
    {
        name: "🏡 Dvorek Karlín",
        url: "https://www.dvorekkarlin.com/denni-nabidka/",
        locationUrl: "https://maps.app.goo.gl/kivSxE9iMU6rgQj78",
        load: fetchDvorekKarlin,
    },
    {
        name: "☕️ Fuel Bistro",
        url: "https://fuelbistro.cz/",
        locationUrl: "https://maps.app.goo.gl/DhmZ42BbGxaiRXW68",
        load: fetchFuelBistro,
    },
    {
        name: "🍛 Gastro Karlín",
        url: "https://www.gastrokarlin.cz/",
        scrapeUrl: "https://www.menicka.cz/4323-gastro-karlin.html",
        locationUrl: "https://maps.app.goo.gl/Hn9WyxNiLziTtHS37",
        load: fetchMenicka,
    },
    {
        name: "🍔 Peter's pub",
        url: "http://www.peterspub.cz/",
        scrapeUrl: "https://www.menicka.cz/4230-peters-pub.html",
        locationUrl: "https://maps.app.goo.gl/b6dyMJXK1q8VEG897",
        load: fetchMenicka,
    },
    {
        name: "🍺 Pivo Karlín",
        url: "https://www.pivokarlin.cz/",
        locationUrl: "https://maps.app.goo.gl/iWD3jubpzKhbMRFk8",
        load: fetchPivokarlin,
    },
]

const fetchMenus = async (): Promise<Menu[]> => {
    const enabledScrappers = scrappers.filter(scrapper => !scrapper.disabled);

    const results = await Promise.allSettled(
        enabledScrappers.map(scrapper => scrapper.load(scrapper))
    );

    const failures: string[] = [];

    results.forEach((res, i) => {
        if (res.status === 'rejected') {
            const scrapper = enabledScrappers[i];
            console.warn(`❌ Scraper ${scrapper.name} failed:`, res.reason?.message || res.reason);
            failures.push(scrapper.name);
        }
    });

    return results
        .filter((res): res is PromiseFulfilledResult<Menu> => res.status === 'fulfilled')
        .map(res => res.value);
}

export {
    fetchMenus
}