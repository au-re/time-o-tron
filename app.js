const request = require("superagent");
const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment-timezone");

const port = process.env.PORT || 8080;
const app = express().use(bodyParser.json());

// Sets server port and logs message on success
app.listen(port, () => console.log(`webhook is listening on port: ${port}`));


// Sends response messages via the Send API
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
    console.log(`Message sent: ${response} to: ${sender_psid}`);

  } catch (error) {
    console.error(`Unable to send message: ${error}`);
  }
}

// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;
  const currenTime = moment();
  if (received_message.text) { // Check if the message contains text
    response = {
      text: `You sent the message: "${received_message.text}" current time: "${currenTime.format("YY-MM-DD hh:mm")}"`,
    };
  }

  // Sends the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  console.log("POST /webhook");

  // Parse the request body from the POST
  const { body } = req;

  // Check the webhook event is from a Page subscription
  if (body.object === "page") {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach((entry) => {
      // Get the webhook event. entry.messaging is an array, but
      // will only ever contain one event, so we get index 0
      const webhook_event = entry.messaging[0];
      const sender_psid = webhook_event.sender.id;
      console.log(webhook_event);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Return a "200 OK" response to all events
    res.status(200).send("EVENT_RECEIVED");

  } else {
    // Return a "404 Not Found" if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint
app.get("/webhook", (req, res) => {
  console.log("GET /webhook");

  const VERIFY_TOKEN = "random_cat";

  // Parse params from the webhook verification request
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {

    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {

      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);

    } else {
      // Responds with "403 Forbidden" if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

app.get("/about", (req, res) => {
  console.log("GET /about");

  return res.status(200).send({
    version: "0.0.1",
  });
});
