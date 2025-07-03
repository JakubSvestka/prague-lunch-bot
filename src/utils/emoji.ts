export function getEmojiForText(text: string): Set<string>
{
    const patterns = [
        // Meats & Poultry
        { regex: /\b(kuřec\w*|pollo|křídla|supreme|krůt\w*)\b/i, emoji: 'poultry_leg' },
        { regex: /\b(hověz\w*|beef|svíčková|roštěná|bibimbap|biftek\w*)\b/i, emoji: 'cut_of_meat' },
        { regex: /\b(vepř\w*|pork|krkovičk\w*|kotlet\w*|duroc|tonkatsu|řízek|krkovic\w*|panenk\w*|konfitovan\w*|mlet\w*\s*maso)\b/i, emoji: 'bacon' },
        { regex: /\b(párek|hot\s?dog|klobás\w*)\b/i, emoji: 'hotdog' },
        { regex: /\b(ryb\w*|fish|losos|treska|filé|seafood|kreveta|shrimp|krab|mořsk\w*|mořské\ plody|mořský)\b/i, emoji: 'fish' },
        { regex: /\b(krevet\w*|shrimp|krab|mořsk\w*|seafood|tom chien)\b/i, emoji: 'shrimp' },

        // Vegetarian / Vegan / Vegetables / Mushrooms
        { regex: /\b(vegetarián\w*|vegansk\w*|vegan|vegetable|zelenin\w*|brokolice|květák|luštěnin\w*|fazol\w*|chilli|paprika|kukuřic\w*|jackfruit|tofu|lilek|batát\w*|mrkev|dýň\w*|pepř|pórek|cibul\w*|česnek|kopr|petržel|pažitka|koriandr|špenát|rukola|bazalka|majoránka|rozmarýn|tymian|okur\w*)\b/i, emoji: 'broccoli' },
        { regex: /\b(houb\w*|mushroom|žampion|bambus|hlív\w*|shiitake|enoki|hříbek|bedla|kozák)\b/i, emoji: 'mushroom' },

        // Pasta & Rice
        { regex: /\b(špaget\w*|spaghetti|carbonara|rag[úu]|bolognese|tagliatelle|lasagn\w*|kolínk\w*|těstovin\w*|nudl\w*|nudličk\w*)\b/i, emoji: 'spaghetti' },
        { regex: /\b(rýž\w*|rice|rizot\w*|risotto|basmati|jasmín|sezamov\w*|těstovinov\w* rýž\w*|rýžov\w* nudl\w*)\b/i, emoji: 'rice' },

        // Fast Food & Street Food
        { regex: /\b(burger\w*|cheeseburger|beef burger|goat burger|asian burger)\b/i, emoji: 'hamburger' },
        { regex: /\b(pizza)\b/i, emoji: 'pizza' },
        { regex: /\b(tortilla|burrito|fajita|wrap|quesadilla|taco|křupav\w* tortilla)\b/i, emoji: 'taco' },

        // Soups & Stews
        { regex: /\b(polévka|soup|vývar|gazpacho|kulajda|boršč|tom yum|tom yam|guláš|gulash|tikka masala|mexick\w* fazolov\w*)\b/i, emoji: 'stew' },

        // Salads & Sides
        { regex: /\b(salát|coleslaw|caesar|zelí|zeln\w* salát|vinaigrette|zeleninov\w* salát|tabouleh|couscous)\b/i, emoji: 'green_salad' },
        { regex: /\b(brambor\w*|potato|fries|kaše|grenailles|pečen\w* brambor\w*|bramborov\w* kaš\w*|mačkan\w* brambor\w*|knedlík\w*|houskov\w* knedlík\w*)\b/i, emoji: 'fries' },
        { regex: /\b(chléb|baget\w*|rohlík|croissant|chlebíček|housk\w*|pečiv\w*)\b/i, emoji: 'bread' },

        // Cheese, Dairy & Eggs
        { regex: /\b(sýr|sýry|parmazán|mozzarella|gouda|bryndza|tvaroh|smetan\w*|zakysan\w* smetan\w*|majonéz\w*|vejce|sázen\w* vejce|vajíčk\w*|sour cream)\b/i, emoji: 'cheese_wedge' },
        { regex: /\b(vejce|sázen\w* vejce|vajíčk\w*)\b/i, emoji: 'egg' },

        // Desserts & Sweets
        { regex: /\b(dezert|cake|koláč|buchta|palačink\w*|lívanc\w*|tvaroh|čokoládov\w* kokosov\w* buchta|čokolád\w*|kokosov\w*)\b/i, emoji: 'chocolate_bar' },
        { regex: /\b(palačink\w*|lívanc\w*|pancak\w*)\b/i, emoji: 'pancakes' },

        // Fruits
        { regex: /\b(jahod\w*|strawberry|jablk\w*|banán\w*|meloun|watermelon|citron\w*|pomeranč\w*|limet\w*|pomelo|brusink\w*)\b/i, emoji: 'strawberry' },

        // Drinks
        { regex: /\b(piv\w*|beer|lager|ležák|alkohol\w*)\b/i, emoji: 'beer' },
        { regex: /\b(vín\w*|wine|rum|whisky|koktejl|cocktail|smoothie|juice|džus|káva|coffee|čaj|tea)\b/i, emoji: 'tropical_drink' },

        // Spicy & Curry & Asian
        { regex: /\b(kar\w*|curry|kimchi|chill\w*|chipotle|gochujang|sriracha|teriyaki|ústroicov\w*|katsu kari|sezamov\w*|wok|kaštan\w*|vodní kaštan)\b/i, emoji: 'curry' },

        // Asian dishes / noodles / sushi
        { regex: /\b(sushi|makizushi|ramen|nudl\w*|pho|udon|bun bo|bibimbap|tom yum)\b/i, emoji: 'ramen' },

        // Extra Desserts & Sweets
        { regex: /\b(donut\w*|doughnut\w*|koblih\w*|berliner)\b/i, emoji: 'doughnut' },
        { regex: /\b(cupcake\w*|muffin\w*|cup\s?cake)\b/i, emoji: 'cupcake' },
        { regex: /\b(zmrzlin\w*|ice\s?cream|gelato|sorbet)\b/i, emoji: 'ice_cream' },
        { regex: /\b(sušenka\w*|cookie\w*|biscuit\w*)\b/i, emoji: 'cookie' },
        { regex: /\b(pudink\w*|pudding\w*|želé|custard|gelatin)\b/i, emoji: 'custard' },

        // Extra Baked / Breadlike
        { regex: /\b(croissant\w*|butter\s?roll|rohlík máslový|kipferl)\b/i, emoji: 'croissant' },
        { regex: /\b(bagel\w*)\b/i, emoji: 'bagel' },
        { regex: /\b(waffle\w*|vafle)\b/i, emoji: 'waffle' },
    ]

    const lower = text.toLowerCase()
    const emojis = new Set<string>();
    for (const { regex, emoji } of patterns) {
        if (regex.test(lower)) {
            emojis.add(emoji)
        }
    }

    return emojis
}
