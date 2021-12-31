const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

const stripTrailingSlash = (str) => {
	return str.endsWith('/') ?
		str.slice(0, -1) :
		str;
};

const BaseUrl = stripTrailingSlash(process.env.TS_API_BASE_URL);
const Secret = process.env.TS_API_KEY;
const roleId = process.env.TS_ROLE_ID;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('gettskey')
		.setDescription('Retrieves a Teamspeak privilege key!'),
	async execute(interaction) {
		await axios.get(BaseUrl + '/privilegekeyadd', {
			params: {
				tokenid1: roleId,
				tokenid2: '0',
				tokentype: '0',
				tokendescription: `${interaction.user.tag}`,
			},
			headers: {
				'x-api-key': Secret,
			},
		}).then(async (response) =>
			await interaction.reply({ content: `Your Token is \`${response.data.body[0].token}\``, ephemeral: true }));
	},
};