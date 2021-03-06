require('dotenv').config();

const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const Token = process.env.CLIENT_TOKEN;
const ClientId = process.env.CLIENT_ID;


const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const rest = new REST({ version: '9' }).setToken(Token);

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

console.log(commands);

rest.put(Routes.applicationCommands(ClientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);