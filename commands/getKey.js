const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const mongo = require('../mongo');

const tsConfigSchema = require('../schemas/tsConfigSchema');
const roleMappingSchema = require('../schemas/roleMappingSchema');

const retrieveKey = async (roleId, user, config) => {
	return await axios.get(config.baseUrl + '/privilegekeyadd', {
		params: {
			tokenid1: roleId,
			tokenid2: '0',
			tokentype: '0',
			tokendescription: `${user.tag}`,
		},
		headers: {
			'x-api-key': config.apiKey,
		},
	}).then(async (response) => {
		return response.data.body[0].token;
	});
};

const retrieveGuildConfig = async (guild) => {
	return await mongo().then(async mongoose => {
		try {
			console.log('DbConnection Established');

			return await tsConfigSchema.findById(guild.id).exec()
				.then(async config => {
					console.log(`Retrieved TS configuration for guild ${guild.id}`);
					return config;
				}).catch(error => {
					console.log(`error while retrieving ts configuration for guild ${guild.id}`);
					console.log(error);
					throw error;
				});

		}
		finally {
			mongoose.connection.close();
			console.log('DbConnection Closed');
		}
	});
};

const retrieveGuildRoleMappings = async (guild) => {
	return await mongo().then(async mongoose => {
		try {
			console.log('DbConnection Established');

			return await roleMappingSchema.find({ guildId: guild.id }).exec()
				.then(async mappings => {
					console.log(`Retrieved role mappings for guild ${guild.id}`);

					return mappings;
				}).catch(error => {
					console.log(`error while retrieving role mappings for guild ${guild.id}`);
					throw error;
				});
		}
		finally {
			mongoose.connection.close();
			console.log('DbConnection Closed');
		}
	});
};

const createRoleMappingArray = (roleMappings) => {
	const res = [];

	for (const roleMap of roleMappings) {
		res[roleMap._id] = roleMap.tsRoleId;
	}

	return res;
};


module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-key')
		.setDescription('Retrieves Teamspeak privilege keys mapped to your roles!'),
	async execute(interaction) {
		const { guild, member, user } = interaction;

		const config = await retrieveGuildConfig(guild);

		if (!config) {
			await interaction.reply({
				content: 'Bot is not configured on your server! use `/configure-ts` to configure it!',
				ephemeral: true,
			});

			return;
		}

		const guildRoleMappingsObject = await retrieveGuildRoleMappings(guild);

		if (typeof guildRoleMappingsObject === 'object' && Object.keys(guildRoleMappingsObject).length === 0) {
			await interaction.reply({
				content: 'Role are mappings not configured for your server! use `/configure-roles` to configure them!',
				ephemeral: true,
			});

			return;
		}

		const guildRoleMappings = createRoleMappingArray(guildRoleMappingsObject);

		let alreadyReplied = false;

		for (const roleId of member._roles) {
			const tsRoleId = guildRoleMappings[roleId];
			const discordRole = guild.roles.cache.find(r => r.id === roleId);
			let reply = '';

			if(!tsRoleId) {
				continue;
			}

			try {
				const key = await retrieveKey(tsRoleId, user, config);

				reply = `Your key for role ${discordRole} is \`${key}\``;
			}
			catch (error) {
				console.log(error);
				reply = `Error while retrieving key for role ${discordRole}`;
			}

			if (!alreadyReplied) {
				alreadyReplied = true;

				await interaction.reply({ content: reply, ephemeral: true });
				continue;
			}

			await interaction.followUp({ content: reply, ephemeral: true });
		}

		if(!alreadyReplied) {
			await interaction.reply(
				{ content: 'None of your current roles qualify for an access token!', ephemeral: true },
			);
		}
	},
};