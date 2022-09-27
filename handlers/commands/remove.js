const Discord = require("discord.js");
const functions = require("../functions.js");

module.exports.run = async (interaction) => {
    let username = interaction.options.getString("username");

    functions.getUUID(username).then(async (data) => {
        if (!data.name) {
            const errorEmbed = new Discord.EmbedBuilder()
                .setColor('#a84040')
                .setDescription("`" + username + "` isn't a valid player!")
                .setTimestamp();
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }
        let isDb = await functions.removeUser(data.uuid);
        if (isDb) {
            const errorEmbed = new Discord.EmbedBuilder()
                .setColor('#36699c')
                .setDescription("Successfully removed `" + data.name + "`.")
                .setTimestamp();
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }).catch((err) => {
        console.error(err);
        const errorEmbed = new Discord.EmbedBuilder()
            .setColor('#a84040')
            .setDescription("An error occurred! Please try again.")
            .setTimestamp();
        interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        return;
    });
};