import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import {Menu} from "../types";
import {OpenAI} from "openai/client";

const generatePage = async (menus: Menu[]): Promise<boolean> => {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    async function translate(menus: Menu[]): Promise<Menu[]>
    {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" }, // ensures valid JSON
            messages: [
                {
                    role: "system",
                    content: `
                        You are a translation engine.
                        You receive a JSON and must return it in the exact same structure.
                        Do not add, remove, or rename any fields.
                        Do not add explanations, notes, or new keys.
                        Return only valid JSON.
                    `
                },
                {
                    role: "user",
                    content: `
                        Translate only the string values in name and description in items attributes this JSON to English. 
                        Do not translate name of a restaurant.
                        Keep structure and keys identical.
                        
                        ${JSON.stringify({menus}, null, 2)}
                    `
                }
            ],
        });

        return JSON.parse(response?.choices[0]?.message?.content?.trim() ?? "").menus;
    }

    fs.mkdirSync(path.join(__dirname, "../../dist"), { recursive: true });

    fs.writeFileSync(
        path.join(__dirname, "../../dist/menus.json"),
        JSON.stringify({ date: dayjs().format("YYYY-MM-DD"), menus: {cz: menus, en: await translate(menus)}}, null, 2)
    );

    fs.copyFileSync(path.join(__dirname, "../../template/index.html"), path.join(__dirname, "../../dist/index.html"));
    fs.copyFileSync(path.join(__dirname, "../../assets/avatar_256px.png"), path.join(__dirname, "../../dist/avatar.png"));

    console.log("✅ menus.json and HTML copied to dist");

    return true;
};

export default generatePage


