# twitter-sentiment

This project contains 3 services.

First service writen in node is twitter-historical service that collects data from cryptocompare api, collecting tweets and aggregating tweets. 
Also is connecting frontend with database.

Second service written in node is sentiment-parser is taking tweets from db and with help of npm package vader-sentiment calculating sentiment 
and storing it into database

Third service is sentiment-ui written in React. It contains 2 graphs, price graph and semtinemt graph through the time.

In order to run project it is necessary to add .env file in root of twitter-historical seervice.
This is .env file:

NODE_ENV=development
PORT=3001
MONGO_URL=mongodb://localhost:27017/tweets
TWITTER_API_KEY=VCCF71AEH2ININwVT52FbuNEM
TWITTER_API_KEY_SECRET=vcj0M3LS5nZa9A6haq2rBFsuHYo95iNqeY6MXPru2DtzA05KzV
TWITTER_BEARER_TOKKEN=AAAAAAAAAAAAAAAAAAAAAGcdVgEAAAAAMNsyPTmJQ4SxIZefib61wTQWsxA%3DdkNnT1GXn1zYVDoJRsFfwlUdSgvGueMY9n2rukTCiUUwGurMww


After that run twitter-historical service with command 'npm run dev'. It will run also mongo db on url: 'mongodb://localhost:27017/tweets'
After service is runned it is necessary to import mongodb collections prices.csv and dailysentiments.csv from where we will collect data for ui.
Easiest way to do it is to use MongoDB Compass. 

Next step is to run sentiment-ui service with command: 'npm start'. Then in browser open address localhost:3000 to see ui

