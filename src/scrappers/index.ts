import {Menu, Scrapper} from "../types";
import {fetchPivokarlin} from "./pivokarlin";
import {fetchAsiyo} from "./asiyo";
import {fetchFuelBistro} from "./fuelBistro";
import {fetchMenicka} from "./menicka";
import {fetchJidlovice} from "./jidlovice";
import dayjs from "../utils/dayjs";
import {fetchProtiProudu} from "./protiProudu";

const scrappers: Scrapper[] = [
    {
        id: "asiyo",
        icon: "🍣",
        icon_name: "sushi",
        name: "Asiyo",
        url: "https://www.asiyo.cz/poledni-menu/",
        locationUrl: "https://maps.app.goo.gl/2yzue2EHDx8SSYCa9",
        coordinates: { lat: 50.0945465, lng: 14.4573329 },
        load: fetchAsiyo,
        disabled: true,
    },
    {
        id: "diego_pivni_bar",
        icon: "🎯",
        icon_name: "dart",
        name: "Diego pivní bar",
        url: "http://www.diegopivnibar.cz/cz/",
        scrapeUrl: "https://www.menicka.cz/7191-diego-pivni-bar.html",
        locationUrl: "https://maps.app.goo.gl/WaBWra3W2ebzZ73p8",
        coordinates: { lat: 50.0947634, lng: 14.4552377 },
        load: fetchMenicka,
    },
    {
        id: "dvorek_karlin",
        icon: "🏡",
        icon_name: "house_with_garden",
        name: "Dvorek Karlín",
        url: "https://www.dvorekkarlin.com/cs/denni-menu",
        scrapeUrl: "https://www.menicka.cz/2427-dvorek-karlin.html",
        locationUrl: "https://maps.app.goo.gl/kivSxE9iMU6rgQj78",
        coordinates: { lat: 50.091655, lng: 14.4507984 },
        load: fetchMenicka,
    },
    {
        id: "fuel_bistro",
        icon: "☕️",
        icon_name: "coffee",
        name: "Fuel Bistro",
        url: "https://fuelbistro.cz/",
        scrapeUrl: "https://www.fuelbistro.cz/menu",
        locationUrl: "https://maps.app.goo.gl/DhmZ42BbGxaiRXW68",
        coordinates: { lat: 50.091978, lng: 14.4576017 },
        load: fetchFuelBistro,
    },
    {
        id: "gastro_karlin",
        icon: "🍛",
        icon_name: "curry",
        name: "Gastro Karlín",
        url: "https://www.gastrokarlin.cz/",
        scrapeUrl: "https://www.menicka.cz/4323-gastro-karlin.html",
        locationUrl: "https://maps.app.goo.gl/Hn9WyxNiLziTtHS37",
        coordinates: { lat: 50.092543, lng: 14.4507045 },
        load: fetchMenicka,
    },
    {
        id: "jidlovice",
        icon: "🍽️",
        icon_name: "knife_fork_plate",
        name: "Jídlovice",
        url: "https://www.jidlovice.cz/karlin/",
        scrapeUrl: `https://www.jidlovice.cz/api/v1/branch/2/menu/${dayjs().format('YYYY-MM-DD')}?include_internal_tags=false`,
        locationUrl: "https://maps.app.goo.gl/fK3T5j2mh5XpfGQS9",
        coordinates: { lat: 50.0946397, lng: 14.4488777 },
        load: fetchJidlovice,
    },
    {
        id: "la_perla_de_karlin",
        icon: "🥘",
        icon_name: "paella",
        name: "La Perla de Karlín",
        url: "https://laperladekarlin.cz/",
        scrapeUrl: "https://www.menicka.cz/9624-la-perla-de-karlin.html",
        locationUrl: "https://www.google.com/maps/search/La+Perla+de+Karlin,+Saldova+9,+Praha+8",
        coordinates: { lat: 50.0941845, lng: 14.4548702 },
        load: fetchMenicka,
    },
    {
        id: "peters_pub",
        icon: "🍔",
        icon_name: "burger",
        name: "Peter's pub",
        url: "http://www.peterspub.cz/",
        scrapeUrl: "https://www.menicka.cz/4230-peters-pub.html",
        locationUrl: "https://maps.app.goo.gl/b6dyMJXK1q8VEG897",
        coordinates: { lat: 50.0908013, lng: 14.4528336 },
        load: fetchMenicka,
    },
    {
        id: "pivo_karlin",
        icon: "🍺",
        icon_name: "beer",
        name: "Pivo Karlín",
        url: "https://www.pivokarlin.cz/",
        scrapeUrl: "http://me.jakubsvestka.cz/pivo_karlin.php", // they block some IP addresses
        locationUrl: "https://maps.app.goo.gl/iWD3jubpzKhbMRFk8",
        coordinates: { lat: 50.0916851, lng: 14.4575721 },
        load: fetchPivokarlin,
    },
    {
        id: "proti_proudu",
        icon: "🌊",
        icon_name: "ocean",
        name: "Proti proudu",
        url: "https://bistroprotiproudu.cz",
        scrapeUrl: "https://bistroprotiproudu.cz/menu",
        locationUrl: "https://maps.app.goo.gl/XcSJSeoGYGWhgAio8",
        coordinates: { lat: 50.0944559, lng: 14.4561641 },
        load: fetchProtiProudu,
    },
    {
        id: "polevkarna",
        icon: "🥣",
        icon_name: "bowl_with_spoon",
        name: "Polévkárna",
        url: "http://www.polevkarna.cz/",
        scrapeUrl: "https://www.menicka.cz/2416-polevkarna.html",
        locationUrl: "https://www.google.com/maps/search/Polevkarna,+Sokolovska+86,+Praha+8",
        coordinates: { lat: 50.0937871, lng: 14.4507792 },
        load: fetchMenicka,
    },
    {
        id: "u_tunelu",
        icon: "🛤️",
        icon_name: "railway_track",
        name: "U Tunelu",
        url: "https://www.utunelu.cz/",
        scrapeUrl: "https://www.menicka.cz/4379-u-tunelu.html",
        locationUrl: "https://www.google.com/maps/search/U+Tunelu,+Thamova+1,+Praha+8",
        coordinates: { lat: 50.0906192, lng: 14.4531312 },
        load: fetchMenicka,
    },
    {
        id: "happy_nuddles",
        icon: "🍜️",
        icon_name: "ramen",
        name: "Happy nuddles",
        url: "https://www.instagram.com/happysushipraha8",
        locationUrl: "https://maps.app.goo.gl/y7YttdjPQGrNUXJdA",
        coordinates: { lat: 50.09376001987864, lng: 14.451839020243082 },
    },
    {
        id: "bowlers",
        icon: "🥑️",
        icon_name: "avocado",
        name: "Bowlers",
        url: "https://bowlers.choiceqr.com",
        locationUrl: "https://maps.app.goo.gl/yYFWbjBoHQ2hzJ559",
        coordinates: { lat: 50.09641554588942, lng: 14.460360533725112 },
    },
    {
        id: "balam_coffee",
        icon: "🥪",
        icon_name: "sandwich",
        name: "BA-LĂM Coffee",
        url: "https://www.instagram.com/balamcoffee_",
        locationUrl: "https://maps.app.goo.gl/5PP6T6etaZS3Zsp99",
        coordinates: { lat: 50.095026475480935, lng: 14.456119808523471 },
    },
    {
        id: "indian_by_nature",
        icon: "🫓",
        icon_name: "flatbread",
        name: "Indian by Nature",
        url: "https://en.ibn.delivery/",
        locationUrl: "https://www.google.com/maps/search/Indian+by+Nature,+Pernerova+478%2F1,+Praha+8",
        coordinates: { lat: 50.0893786, lng: 14.4450473 },
    },
    {
        id: "gemuse_corner_kebab",
        icon: "🌯",
        icon_name: "burrito",
        name: "Gemüse Corner Kebab",
        url: "https://wolt.com/cs/cze/prague/restaurant/gemuse-corner-kebab-karlin",
        locationUrl: "https://www.google.com/maps/search/Gemuse+Corner+Kebab,+Sokolovska+79,+Praha+8",
        coordinates: { lat: 50.0938435, lng: 14.4497467 },
    },
    {
        id: "khomfi",
        icon: "🥟",
        icon_name: "dumpling",
        name: "Khomfi",
        url: "https://www.khomfi.cz",
        locationUrl: "https://www.google.com/maps/search/Khomfi,+Vitkova+18,+Praha+8",
        coordinates: { lat: 50.0913938, lng: 14.4453713 },
    },
    {
        id: "bali_bali",
        icon: "🍱",
        icon_name: "bento",
        name: "Bali Bali",
        url: "https://bali-bali-karlin.eatbu.com/",
        locationUrl: "https://www.google.com/maps/search/Bali+Bali,+Thamova+18,+Praha+8",
        coordinates: { lat: 50.0924153, lng: 14.4525107 },
    },
    {
        id: "sangam",
        icon: "🌶️",
        icon_name: "hot_pepper",
        name: "Sangam Indian Restaurant",
        url: "https://sangam.cz/",
        locationUrl: "https://www.google.com/maps/search/Sangam+Indian+Restaurant,+Sokolovska+71,+Praha+8",
        coordinates: { lat: 50.0935880, lng: 14.4486270 },
    },
]

const fetchMenus = async (scrapperId?: string): Promise<Menu[]> => {
    const enabledScrappers = scrappers
        .filter((scrapper) => !scrapperId || scrapper.id === scrapperId)
        .filter(scrapper => !scrapper.disabled);

    const results = await Promise.allSettled(
        enabledScrappers
            .filter(scrapper => scrapper.load)
            .map(scrapper => scrapper.load!(scrapper))
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

const getRestaurants = () => {
    return scrappers
        .filter(scrapper => !scrapper.disabled)
        .map(({ id, icon, icon_name, name, url, locationUrl, coordinates }) => ({
            id, icon, icon_name, name, url, locationUrl, coordinates,
        }));
}

export {
    fetchMenus,
    getRestaurants,
}