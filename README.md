# time-o-tron 🤖

What time is it in ... ? Ask Time-o-Tron!

A simple chatbot demo using Microsoft's Bot Framework

Test commands
---

```
curl -X GET "localhost:1337/webhook?hub.verify_token=random_cat&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
```

```
curl -H "Content-Type: application/json" -X POST "localhost:1337/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}'
```
