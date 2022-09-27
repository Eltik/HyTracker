module.exports = async (client, interaction) => {

    if (interaction.isButton()) {
        
    }

    // Commands
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;
        try {
            command.run(interaction);
            let text;
            if (interaction.options._hoistedOptions.length === 0 && !interaction.options._subcommand) {
                text = `${interaction.member.user.tag} used /${interaction.commandName}.`.dim;
            }
            if (interaction.options._subcommand != null) {
                if (interaction.options._hoistedOptions.length > 0) {
                    let hoistedOptions = "";
                    for (let i = 0; i < interaction.options._hoistedOptions.length; i++) {
                        let option = interaction.options._hoistedOptions[i];
                        let name = option.name;
                        let value = option.value;
                        hoistedOptions += " " + value + "[" + name + "]";
                    }
                    text = `${interaction.member.user.tag} used /${interaction.commandName} ${interaction.options._subcommand}${hoistedOptions}.`.dim;
                } else {
                    text = `${interaction.member.user.tag} used /${interaction.commandName} ${interaction.options._subcommand}.`.dim;
                }
            }
            if (interaction.options._hoistedOptions.length > 0) {
                let hoistedOptions = "";
                for (let i = 0; i < interaction.options._hoistedOptions.length; i++) {
                    let option = interaction.options._hoistedOptions[i];
                    let name = option.name;
                    let value = option.value;
                    hoistedOptions += " " + value + "[" + name + "]";
                }
                text = `${interaction.member.user.tag} used /${interaction.commandName}${hoistedOptions}.`.dim;
            }
            console.log(text)
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};