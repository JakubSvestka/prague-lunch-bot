import {Menu} from "../types"
import axios from "./axios"
import dayjs from "./dayjs"

const send = async (menus: Menu[]): Promise<boolean> => {
    try {
        dayjs.locale('en')
        const text = `🥗 ${dayjs().format("dddd")} Lunch Picks - ${dayjs().format("DD. MM. YYYY")}`
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
                    text: "Here are today’s lunch menus from favorite spots around office. Enjoy!\nIs your favorite spot missing? Ping <slack:\/\/user?team=E03D4T4JK63&id=U05HEGVRVCY|me>!"
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Open Menu :flag-cz:",
                            "emoji": true
                        },
                        "url": "https://jakubsvestka.github.io/prague-lunch-bot/?lang=cz",
                        "action_id": "open_menu_button_cz"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Open Menu :uk:",
                            "emoji": true
                        },
                        "url": "https://jakubsvestka.github.io/prague-lunch-bot/?lang=en",
                        "action_id": "open_menu_button_en"
                    }
                ]
            },
        ]
        const mainMsg = await postSlackMessage(
            headerBlocks,
            text
        )
        const threadTs = mainMsg.ts

        for (const menu of menus) {
            const menuMsg = await postSlackMessage(
                createMenuMessage(menu),
                menu.name,
                threadTs
            )
        }

        console.log("Menus posted in thread successfully.")

        return true
    } catch (error) {
        console.error("Error posting menus:", error)

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
    )

    if (!res.data.ok) {
        throw new Error(`Slack API error: ${res.data.error}`)
    }

    return res.data
}

async function addSlackReaction(ts: string, emojiName: string) {
    const res = await axios.post(
        "https://slack.com/api/reactions.add",
        { channel: process.env.SLACK_CHANNEL, timestamp: ts, name: emojiName },
        { headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` } }
    )

    if (!res.data.ok) {
        console.warn(`Failed to add reaction ${emojiName}: ${res.data.error}`)
    }

    return res.data
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
    })
    blocks.push({
        type: "context",
        elements: [
            {
                type: "mrkdwn",
                text: `<${menu.url}|🌐 Visit web> \t <${menu.locationUrl}|📍 Location>\t`,
            },
        ],
    })

    const sortedItems = menu.items
        .sort((a, b) => a.isSoup ? -1 : 0)
        .sort((a, b) => a.isVegetarian ? 1 : 0)

    for (const [index, item] of sortedItems.entries()) {
        blocks.push({
            type: "section",
            fields: [
                {
                    "type": "mrkdwn",
                    "text": `<https://www.google.com/search?udm=2&q=${item.name}|*${item.name.trim()}*>${item.price ? ` – ${item.price}\u00A0Kč` : ''}${item.isSoup ? ' :soup:':''}${item.isVegetarian ? ' :vegan_green_logo:':''}`
                },
                item.description ? {
                    "type": "mrkdwn",
                    "text": item.description.trim()
                } : null
            ].filter(Boolean)
        })

        blocks.push({ type: "divider" })
    }

    return blocks
}

export {
    send
}