import * as bodyParser from "body-parser";
import { BotFrameworkAdapter, ConversationState, MemoryStorage } from "botbuilder";
import * as dotenv from "dotenv";
import * as express from "express";

import { MyBot } from "./bot";

dotenv.config();

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

// server
const port = process.env.PORT || 3939;
const app = express().use(bodyParser.json());
app.set("name", process.env.BOT_NAME);

app.post("/api/messages", (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await myBot.onTurn(context);
  });
});

app.listen(port, () => console.log(`\n${app.get("name")} listening on ${port}`));
