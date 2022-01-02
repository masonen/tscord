const mongoose = require('mongoose');

const requiredString = {
	type: String,
	required: true,
};

const roleMappingSchema = mongoose.Schema({
	_id: requiredString,
	guildId: requiredString,
	tsRoleId: requiredString,
});

module.exports = mongoose.model('roleMapping', roleMappingSchema);