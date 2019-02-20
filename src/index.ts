import * as bodyParser from "body-parser";
import { BotFrameworkAdapter, ConversationState, MemoryStorage } from "botbuilder";
import express from "express";
import * as packageJson from "../package.json";

import { MyBot } from "./bot";

const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const adapter = new BotFrameworkAdapter();

const myBot = new MyBot(conversationState);

// if something goes wrong, notify the user and clear the state
adapter.onTurnError = async (context, error) => {
  console.error(`\n [onTurnError]: ${error}`);
  await context.sendActivity("Oops. Something went wrong!");
  await conversationState.delete(context);
};

const port = process.env.PORT || 3939;
const app = express().use(bodyParser.json());

app.set("name", process.env.BOT_NAME);
app.set("version", packageJson.version);

app.post("/api/messages", (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await myBot.onTurn(context);
  });
});

app.get("/about", (req, res) => {
  return res.status(200).send({
    name: req.app.get("name"),
    version: req.app.get("version"),
  });
});

app.listen(port, () => console.log(`\n${app.get("name")} listening on http://localhost:${port}`));
