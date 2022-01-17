import logger from "../logger";
const vader = require('vader-sentiment');
import Tweet from "../models/Tweet";
import Sentiment from "../models/Sentiment";
import { ITweet } from "../models/interfaces/Data";
import { asyncForEach } from "../helpers/helpers";

async function analyzer() {
    return new Promise(async (resolve, reject) => {
        try {
            let rowsCount = await Tweet.count()
            let page = 0;
            const filesPerPage = 1000;
            while (page <= Math.ceil(rowsCount / filesPerPage)) {

                let tweetResponse = await Tweet.find({ created_at: { $lte: ("2020-06-01T01:44:14.000Z") } }).limit(filesPerPage).skip(filesPerPage * page);
                await asyncForEach(tweetResponse, async (tweet: ITweet) => {
                    if (tweet.text) {
                        const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(tweet.text);

                        let sentimentObject = { ...intensity, tweet_created_at: tweet.created_at, tweet_id: tweet.id }
                        let sentimentModelObject = new Sentiment(sentimentObject);
                        await sentimentModelObject.save();

                        // logger.log({
                        //     level: 'silly',
                        //     message: `Succesfully saved sentiment for tweet ${tweet.id} to DB`,
                        //     consoleLoggerOptions: { label: 'CONSUMER' }
                        // });
                    }
                })
                page++;
            }

        } catch (e) {
            reject(e)
            console.log(e);
        }
    })
}
export default analyzer;
