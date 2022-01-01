const mongoose = require('mongoose');

const DbUser = process.env.MONGO_DB_USER;
const DbPassword = process.env.MONGO_DB_PASSWORD;
const DbHost = process.env.MONGO_DB_HOST;
const DbPort = process.env.MONGO_DB_PORT;
const DbName = process.env.MONGO_DB_NAME;
const mongoPath = `mongodb://${DbUser}:${DbPassword}@${DbHost}:${DbPort}/${DbName}?authSource=admin`;

module.exports = async () => {
	await mongoose.connect(mongoPath, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	return mongoose;
};