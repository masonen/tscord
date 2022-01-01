const mongoose = require('mongoose');

const requiredString = {
	type: String,
	required: true,
};

const tsConfigSchema = mongoose.Schema({
	_id: requiredString,
	baseUrl: requiredString,
	apiKey: requiredString,
});

module.exports = mongoose.model('tsConfig', tsConfigSchema);