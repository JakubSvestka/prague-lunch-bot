import {Menu} from "../types";
import {OpenAI} from "openai/client";

export default async (menus: Menu[]): Promise<Menu[]> => {
    if (process.env.OPENAI_API_KEY === undefined) {
        return menus
    }

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" }, // ensures valid JSON
        messages: [
            {
                role: "system",
                content: `
                Normalize the menu items:
                - keep meaning
                - remove allergens from item.name
                - if you are 100% sure about that meal is gluten free/vegetarian, set the flag
                - do not change value of hideInPresentation parameter
                - only soups have set isSoup=true 
                - change only values in menu.items
                - item.description has to contain meaningful information
                 - can't contain single letter
                 - can't contain single word
                 - keep reasonable length
                 - do not repeat information from name itself
                 - do not set description if not needed and a reader knows meaning from name
                - do not translate it to another language (keep it in Czech)
                
                Structure is:
                export type Menu = {
                    id: string;
                    icon: string;
                    icon_name: string;
                    name: string;
                    url: string;
                    locationUrl: string;
                    coordinates: Coordinates;
                    items: MenuItem[];
                };
                
                export type MenuItem = {
                    name: string;
                    description?: string|null;
                    price: number|null;
                    isVegetarian?: boolean;
                    isGlutenFree?: boolean;
                    isSoup?: boolean;
                    hideInPresentation?: boolean;
                };
                
                Json is below:
                `
            },
            {
                role: "user",
                content: JSON.stringify({menus}, null, 2)
            }
        ],
    });

    return JSON.parse(response?.choices[0]?.message?.content?.trim() ?? "").menus;
}