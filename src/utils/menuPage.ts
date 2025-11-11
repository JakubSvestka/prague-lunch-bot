import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import {Menu} from "../types";
import {OpenAI} from "openai/client";
import {createHash} from "node:crypto";

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
                        
                        Translate to English only: 
                         - menus.*.items.*.name
                         - menus.*.items.*.description
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

    fs.mkdirSync(path.join(__dirname, "../../dist"), { recursive: true });

    const menusJson = JSON.stringify({ date: dayjs().format("YYYY-MM-DD"), menus: {cz: menus, en: await translate(menus)}}, null, 2);
    fs.writeFileSync(
        path.join(__dirname, "../../dist/menus.json"),
        menusJson
    );

    // Compute hash of the JSON
    const hash = createHash("sha256").update(menusJson).digest("hex");

    const htmlPath = path.join(__dirname, "../../dist/index.html");
    let html = fs.readFileSync(htmlPath, "utf-8");
    html = html.replace("{{HASH}}", hash);
    fs.writeFileSync(path.join(__dirname, "../../dist/index.html"), html, "utf-8");

    fs.copyFileSync(path.join(__dirname, "../../assets/avatar_256px.png"), path.join(__dirname, "../../dist/avatar.png"));

    console.log("✅ menus.json and HTML copied to dist");

    return true;
};

export default generatePage


