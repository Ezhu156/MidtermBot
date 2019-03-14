# Restaurant Selector Bot

## About
------
The Restuarant Selector Bot helps diminish your indecisiveness when it comes to choosing a place to eat by Tweeting out restaurant suggestions.

Bot was created with Node.js

## How to Use
------
There are two ways this bot works:
1. The bot tweets out a random restuarant suggestion within the United States after 1 hour of inactivity (inactivity means no one has tweeted at the bot)
2. Users can tweet at the bot and the bot will respond with a restuarant suggestion

Note: config.js and config2.js contain API keys, tokens, etc. for the Twitter and Yelp APIs. To run this code, you must get your own API keys from both platforms.

Node Packages Used: Twit, yelp-fusion

## Notes
------
1. Since Yelp is not limited to just food, if you want to look up a location based on price or a non food related keyword, you will sometimes get locations that are not restuarants
2. General note: In order to tweet at the bot and receive a reply, you must be using a public Twitter account