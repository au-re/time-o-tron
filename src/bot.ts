import { ActivityTypes, ConversationState, StatePropertyAccessor, TurnContext } from "botbuilder";

const TURN_COUNT = "turn_count";

export class MyBot {

  private readonly countAccessor: StatePropertyAccessor<number>;
  private readonly conversationState: ConversationState;

  constructor(conversationState) {

    // Creates a new state accessor property.
    // See https://aka.ms/about-bot-state-accessors to learn more about the bot state and state accessors
    this.countAccessor = conversationState.createProperty(TURN_COUNT);
    this.conversationState = conversationState;
  }

  public onTurn = async (turnContext: TurnContext) => {

    if (turnContext.activity.type === ActivityTypes.Message) {

      const count = await this.countAccessor.get(turnContext) || 0;
      await turnContext.sendActivity(`${count} You said '${turnContext.activity.text}'`);
      await this.countAccessor.set(turnContext, count + 2);

    } else {
      await turnContext.sendActivity(`[${turnContext.activity.type} event detected]`);
    }

    await this.conversationState.saveChanges(turnContext);
  }
}
