module.exports = (interaction) => {
	return interaction.member.permissions.has('ADMINISTRATOR');
};
