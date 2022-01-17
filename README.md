# twitter-sentiment

This project contains 3 services.

First service writen in node is twitter-historical service that collects data from cryptocompare api, collecting tweets and aggregating tweets. 
Also is connecting frontend with database.

Second service written in node is sentiment-parser is taking tweets from db and with help of npm package vader-sentiment calculating sentiment 
and storing it into database

Third service is sentiment-ui written in React. It contains 2 graphs, price graph and semtinemt graph through the time.

In order to run project it is necessary to first run twitter-historical service with command 'npm run dev'
