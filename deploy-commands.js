// When registering a new slash command, open a PowerShell window locally (on computer not Ptero panel)
// and do node deploy-commands.js.
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config/config.json');

const commands = [
    new SlashCommandBuilder().setName('track').setDescription('Tracks an user.')
        .addStringOption(option => option.setName('username').setDescription("The Minecraft account to track.").setRequired(true)),
	new SlashCommandBuilder().setName('remove').setDescription('Stops tracking an user.')
        .addStringOption(option => option.setName('username').setDescription("The Minecraft account to stop tracking.").setRequired(true)),
    new SlashCommandBuilder().setName('list').setDescription('Lists all currently tracking users.'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
