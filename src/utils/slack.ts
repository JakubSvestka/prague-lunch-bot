import {Menu} from "../types";
import axios from "./axios";
import dayjs from "./dayjs";

const send = async (menus: Menu[]): Promise<boolean> => {
    try {
        const text = `:fork_and_knife: Today’s lunch menus (${dayjs().format("DD. MM. YYYY")})`
        const headerBlocks = [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text,
                    emoji: true,
                },
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "Here are today’s lunch menus from favorite spots around office. Enjoy!"
                }
            },
            { type: "divider" },
        ];
        const mainMsg = await postSlackMessage(
            headerBlocks,
            text
        );
        const threadTs = mainMsg.ts;

        for (const menu of menus) {
            const menuMsg = await postSlackMessage(
                createMenuMessage(menu),
                menu.name,
                threadTs
            );
        }

        console.log("Menus posted in thread successfully.");

        return true
    } catch (error) {
        console.error("Error posting menus:", error);

        return false
    }
}

async function postSlackMessage(blocks: any[], text: string, threadTs?: string) {
    const res = await axios.post(
        "https://slack.com/api/chat.postMessage",
        {
            channel: process.env.SLACK_CHANNEL,
            text,
            blocks,
            thread_ts: threadTs,
            unfurl_links: false,
            unfurl_media: false,
        },
        { headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` } }
    );

    if (!res.data.ok) {
        throw new Error(`Slack API error: ${res.data.error}`);
    }

    return res.data;
}

async function addSlackReaction(ts: string, emojiName: string) {
    const res = await axios.post(
        "https://slack.com/api/reactions.add",
        { channel: process.env.SLACK_CHANNEL, timestamp: ts, name: emojiName },
        { headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` } }
    );

    if (!res.data.ok) {
        console.warn(`Failed to add reaction: ${res.data.error}`);
    }

    return res.data;
}

const createMenuMessage = (menu: Menu) => {
    const blocks = []

    blocks.push({
        type: "header",
        text: {
            type: "plain_text",
            text: `${menu.name}`,
            emoji: true,
        },
    });
    blocks.push({
        type: "context",
        elements: [
            {
                type: "mrkdwn",
                text: `<${menu.url}|🌐 Visit web> \t <${menu.locationUrl}|📍 Location>\t`,
            },
        ],
    });

    for (const [index, item] of menu.items.entries()) {
        blocks.push({
            type: "section",
            fields: [
                {
                    "type": "mrkdwn",
                    "text": `<https://www.google.com/search?udm=2&q=${item.name}|*${item.name.trim()}*> – ${item.price}\u00A0Kč
                    `
                },
                item.description ? {
                    "type": "mrkdwn",
                    "text": item.description.trim()
                } : null
            ].filter(Boolean)
        });

        if (index < menu.items.length - 1) {
            blocks.push({ type: "divider" });
        }
    }

    return blocks
}

export {
    send
};