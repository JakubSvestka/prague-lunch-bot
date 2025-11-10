import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import {Menu} from "../types";

const generatePage = async (menus: Menu[]): Promise<boolean> => {
    fs.mkdirSync(path.join(__dirname, "../dist"), { recursive: true });

    fs.writeFileSync(
        path.join(__dirname, "../../dist/menus.json"),
        JSON.stringify({ date: dayjs().format("YYYY-MM-DD"), menus }, null, 2)
    );

    fs.copyFileSync(path.join(__dirname, "../../template/index.html"), path.join(__dirname, "../../dist/index.html"));
    fs.copyFileSync(path.join(__dirname, "../../assets/avatar.png"), path.join(__dirname, "../../dist/avatar.png"));

    console.log("✅ menus.json and HTML copied to dist");

    return true;
};

export default generatePage


