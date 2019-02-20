import { ActivityTypes, ConversationState, StatePropertyAccessor, TurnContext } from "botbuilder";
import _ from "lodash";
import moment from "moment-timezone";
import { capitalize, getCityInfo, getLuisIntent } from "./helpers";

const TURN_COUNT = "turn_count";

enum intents {
  TIME_AT_LOCATION = "TIME_AT_LOCATION",
}

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
      const intent = await getLuisIntent(turnContext.activity.text);

      console.log("utterance: ", turnContext.activity.text);
      console.log("intent: ", JSON.stringify(intent));

      const intentName = _.get(intent, "topScoringIntent.intent");
      const cityName = _.get(intent, "entities[0].entity");

      if (intentName === intents.TIME_AT_LOCATION) {

        if (!cityName) {
          return turnContext.sendActivity("I do not understand what city you are interested in");
        }

        console.log("entity", cityName);

        const { country, city, timezone } = getCityInfo(cityName);

        if (!timezone) {
          return turnContext.sendActivity("I cannot find a timezone for this city");
        }

        const currenTime = moment().tz(timezone).format("HH:mm");
        const currentDay = moment().tz(timezone).format("dddd");
        const currentDate = moment().tz(timezone).format("Do");

        const response = `Current time in ${capitalize(city)}, ${capitalize(country)} is
        ${currenTime}, ${currentDay} the ${currentDate}`;

        return turnContext.sendActivity(response);
      }

      return turnContext.sendActivity("This doesn't sound like anything to me");

    } else {
      await turnContext.sendActivity(`[${turnContext.activity.type} event detected]`);
    }

    await this.conversationState.saveChanges(turnContext);
  }
}
