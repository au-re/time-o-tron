const express = require('express');
const builder = require('botbuilder');

require('dotenv').config({silent: true});

const connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector);
const app = express();

app.post('/', connector.listen());

bot.dialog('/', (session) => session.send("Hello World"));

app.listen(8080, () => console.log("🤖 Ready to bot!"));
