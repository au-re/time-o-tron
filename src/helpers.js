const request = require("superagent");

const appId = process.env.LUIS_APP_ID;
const endpointKey = process.env.LUIS_ENDPOINT_KEY;
const endpoint = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/${appId}`;

// Analyze text
//
// utterance = user's text
//
async function getLuisIntent(utterance) {

  try {
    const data = await request
      .get(endpoint)
      .query({
        verbose: true,
        q: utterance,
        "subscription-key": endpointKey,
      });

    return data.body;

  } catch (error) {
    console.log(error);
  }
}

// Sends response messages via Facebook's Send API
async function callSendAPI(sender_psid, response) {
  const request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  try {
    await request
      .post("https://graph.facebook.com/v2.6/me/messages")
      .query({ access_token: process.env.PAGE_ACCESS_TOKEN })
      .send(request_body)
      .set("X-API-Key", "foobar")
      .set("accept", "json");
    console.log(`Message sent: ${response.text} to: ${sender_psid}`);

  } catch (error) {
    console.error(`Unable to send message: ${error}`);
  }
}

module.exports = {
  getLuisIntent,
  callSendAPI,
};
