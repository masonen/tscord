require('dotenv').config();

const Token = process.env.CLIENT_TOKEN;
const {Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.login(Token);