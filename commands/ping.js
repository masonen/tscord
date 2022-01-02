const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('open-source')
		.setDescription('Shows open source information.'),
	async execute(interaction) {
		await interaction.reply('This bot was released under GPL-3.0. You can find the sourcecode via https://github.com/masonen/tscord. Contributions Welcome!');
	},
};