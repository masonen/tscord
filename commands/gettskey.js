const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gettskey')
		.setDescription('Retrieves a Teamspeak privilege key!'),
	async execute(interaction) {
	// 	await axios.get(BaseUrl + '/privilegekeyadd', {
	// 		params: {
	// 			tokenid1: roleId,
	// 			tokenid2: '0',
	// 			tokentype: '0',
	// 			tokendescription: `${interaction.user.tag}`,
	// 		},
	// 		headers: {
	// 			'x-api-key': Secret,
	// 		},
	// 	}).then(async (response) =>
	// 		await interaction.reply({ content: `Your Token is \`${response.data.body[0].token}\``, ephemeral: true }));
	},
};