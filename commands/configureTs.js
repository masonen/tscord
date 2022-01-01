const { SlashCommandBuilder } = require('@discordjs/builders');
const interactionMemberIsAdmin = require('../helper/interactionMemberIsAdmin');

const tsConfigSchema = require('../schemas/tsConfigSchema');
const mongo = require('../mongo');

const stripTrailingSlash = (str) => {
	return str.endsWith('/') ?
		str.slice(0, -1) :
		str;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('configure-ts')
		.setDescription('Configure Teamspeak WebQuery API')
		.addStringOption(option =>
			option.setName('base-url')
				.setDescription('Base Url of WebQuery Api')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('api-key')
				.setDescription('Api Key of WebQuery Api')
				.setRequired(true),
		),

	async execute(interaction) {
		const { guild } = interaction;

		if(!interactionMemberIsAdmin(interaction)) {
			await interaction.reply({ content: 'Only administrators are allowed to use this command!', ephemeral: true });

			return;
		}

		const baseUrl = stripTrailingSlash(interaction.options.getString('base-url'));
		const apiKey = interaction.options.getString('api-key');

		await mongo().then(async (mongoose) => {
			try {
				await tsConfigSchema.findOneAndUpdate(
					{
						_id: guild.id,
					},
					{
						_id: guild.id,
						baseUrl: baseUrl,
						apiKey: apiKey,
					},
					{
						upsert: true,
					},
				);

				await interaction.reply({ content: 'Configuration has been stored!', ephemeral: true });
			}
			catch (e) {
				console.log(e);
			}
			finally {
				await mongoose.connection.close();
			}
		});
	},
};