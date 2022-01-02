const { SlashCommandBuilder } = require('@discordjs/builders');
const interactionMemberIsAdmin = require('../helper/interactionMemberIsAdmin');

const roleMappingSchema = require('../schemas/roleMappingSchema');
const mongo = require('../mongo');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('configure-roles')
		.setDescription('Configure mapping of Discord role to Teamspeak Role Id')
		.addRoleOption(option =>
			option.setName('role')
				.setDescription('Discord role to Map')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('ts-id')
				.setDescription('Mapped Teamspeak Role Id')
				.setRequired(true),
		),

	async execute(interaction) {
		const { guild } = interaction;

		if(!interactionMemberIsAdmin(interaction)) {
			await interaction.reply({ content: 'Only administrators are allowed to use this command!', ephemeral: true });

			return;
		}

		const role = interaction.options.getRole('role');
		const tsId = interaction.options.getString('ts-id');

		await mongo().then(async (mongoose) => {
			try {
				await roleMappingSchema.findOneAndUpdate(
					{
						_id: role.id,
					},
					{
						_id: role.id,
						guildId: guild.id,
						tsRoleId: tsId,
					},
					{
						upsert: true,
					},
				);

				console.log(`${interaction.user.tag} added mapping for ${role.id} to ${tsId} for guild ${guild.id}`);
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