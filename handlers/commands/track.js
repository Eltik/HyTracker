const Discord = require("discord.js");

const functions = require("../functions.js");

module.exports.run = (interaction) => {
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
        let isDb = functions.isInDb(data.uuid);
        if (!isDb) {
            let inserted = await functions.insertUser(data.uuid);
            if (inserted) {
                const successEmbed = new Discord.EmbedBuilder()
                    .setColor('#36699c')
                    .setAuthor({ name: "Now tracking " + data.name + "!", iconURL: "https://mc-heads.net/avatar/" + data.uuid + "/64"})
                    .setTimestamp();
                interaction.reply({ embeds: [successEmbed], ephemeral: true });
            } else {
                const successEmbed = new Discord.EmbedBuilder()
                    .setColor('#a84040')
                    .setAuthor({ name: data.name + " is a legacy user. HyTracker can't track those players yet!", iconURL: "https://mc-heads.net/avatar/" + data.uuid + "/64"})
                    .setTimestamp();
                interaction.reply({ embeds: [successEmbed], ephemeral: true });
            }
        } else {
            const successEmbed = new Discord.EmbedBuilder()
                .setColor('#a84040')
                .setAuthor({ name: data.name + " is already being tracked.", iconURL: "https://mc-heads.net/avatar/" + data.uuid + "/64"})
                .setTimestamp();
            interaction.reply({ embeds: [successEmbed], ephemeral: true });
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