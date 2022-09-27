const Discord = require("discord.js");

const functions = require("../functions.js");

module.exports.run = (interaction) => {
    let users = functions.getUsers();
    let toSend = "";
    for (let i = 0; i < users.length && toSend.length < 1000; i++) {
        if (toSend.length === 0) {
            toSend += "`" + users[i][3] + "`";
        } else {
            toSend += "\n`" + users[i][3] + "`";
        }
    }
    if (toSend.length === 0) {
        toSend = "`No users being tracked.`";
    }
    const successEmbed = new Discord.EmbedBuilder()
        .setColor('#36699c')
        .setTitle("Currently Tracked Users")
        .setDescription(toSend)
        .setTimestamp();
    interaction.reply({ embeds: [successEmbed], ephemeral: true });
};