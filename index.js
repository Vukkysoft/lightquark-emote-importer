require("dotenv").config()
const apiCall = require("./apiCall.js");
const fs = require("fs");
const sharp = require("sharp");

async function start() {
    await checkForExisting();
    await uploadEmotes();
}
async function checkForExisting() {
    const emotes = (await apiCall(`/quark/${process.env.LIGHTQUARK_QUARK}/emotes`)).response.emotes
    if(emotes.length > 0) {
        console.log("Deleting existing emotes...")
        emotes.forEach(function(emote) {
            apiCall(`/quark/${process.env.LIGHTQUARK_QUARK}/emotes/${emote._id}`, "DELETE")
        })
    }
}
async function uploadEmotes() {
    const emotes = fs.readdirSync("emotes");
    console.log("Uploading emotes...")
    for (const emote of emotes) {
        const processedEmote = (await sharp(`emotes/${emote}`).trim().toBuffer()).toString("base64");
        await apiCall(`/quark/${process.env.LIGHTQUARK_QUARK}/emotes`, "POST", {"name": emote.replace(/\.[^/.]+$/, ""), "image": processedEmote, "description": process.env.DEFAULT_DESCRIPTION})
        console.log(`Uploaded ${emote.replace(/\.[^/.]+$/, "")}`)
    }
}

start()