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
                - do not change meaning
                - remove allergens from name
                - add missing description if needed
                - if you are 100% sure about that meal is gluten free/vegetarian, set the flag
                - do not change value of hideInPresentation parameter
                - only soups have set isSoup=true 
                - change only values in menu.items
                - remove item description if does not make sense - description should give meaningful information
                 - no single letter
                 - no single word
                 - keep it short
                - do not translate it do another language (keep it in Czech)
                
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