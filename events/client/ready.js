const functions = require("../../handlers/functions.js");
const config = require("../../config/config.json");

module.exports = client => {
    client.user.setActivity('Bridge Scrims', { type: "WATCHING" });
    console.log(`Logged in as ${client.user.tag}!`.green);

    let guild = client.guilds.cache.get(config.guildId);
    functions.runLoops(guild);
};