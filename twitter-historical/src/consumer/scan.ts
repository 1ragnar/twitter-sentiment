import { IResponse, ITweet, IUser, IExtendedTweet, IPrice } from "../models/interfaces/Data";
import Tweet from "../models/Tweet";
import logger from "../logger";
import { asyncForEach } from "../helpers/helpers";
import Meta from "../models/Meta";
import Sentiment from "../models/Sentiment"
import Price from "../models/Price"

const cc = require('cryptocompare')
cc.setApiKey('c3edd0a02527d9bb623fb75e22bdc2e79827bb7e1a20070ef76fd73e89d988ec')

// Search for Tweets within the past seven days
// https://developer.twitter.com/en/docs/twitter-api/tweets/search/quick-start/recent-search

const needle = require('needle');

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const token = process.env.TWITTER_BEARER_TOKKEN;

const endpointUrl = 'https://api.twitter.com/2/tweets/search/all?';

async function addToDB(json: IResponse) {
    return new Promise(async (resolve, reject) => {
        if (json.data) {
            try {
                await asyncForEach(json.data, async (tweet: ITweet) => {
                    let author: IUser = json.includes.users.find((user: IUser) => user.id === tweet.author_id)


                    let text = tweet.text
                    if (tweet.referenced_tweets && tweet.referenced_tweets[0]?.type === "retweeted") {
                        text = json.includes.tweets.find((refTweet: ITweet) => refTweet.id === tweet.referenced_tweets[0]?.id)?.text
                    }

                    let extendedTweet: IExtendedTweet = {
                        text: text,
                        id: tweet.id,
                        public_metrics: tweet.public_metrics,
                        author: author,
                        created_at: tweet.created_at,
                    }

                    let tweetObject = new Tweet(extendedTweet);
                    await tweetObject.save();

                    logger.log({
                        level: 'silly',
                        message: `Succesfully saved ${tweet.text} Tweet to DB`,
                        consoleLoggerOptions: { label: 'CONSUMER' }
                    });
                })

                const metaObject = new Meta(json.meta)

                await metaObject.save();

                logger.log({
                    level: 'silly',
                    message: `Succesfully saved ${json.meta.next_token} Meta to DB`,
                    consoleLoggerOptions: { label: 'CONSUMER' }
                });

                resolve("New tweet saved");
                return;

            } catch (err) {
                logger.log({
                    level: 'error',
                    message: `Error saving new  tweets`,
                    error: err
                });
                reject(err);
                return;
            }
        }
    })

}


async function getRequest() {
    return new Promise(async (resolve, reject) => {
        // Edit query parameters below
        // specify a search query, and any additional fields that are required
        // by default, only the Tweet ID and text fields are returned

        setTimeout(async () => {
            let lastMetaResponse = await Meta.find().sort({ oldest_id: 1 }).limit(1)


            const params: {
                'query': string,
                'tweet.fields': string,
                "expansions": string,
                "user.fields": string,
                "max_results": string,
                "start_time": string,
                "end_time": string,
                "next_token"?: string
            } = {
                'query': '(#BTC) lang:en',
                'tweet.fields': 'created_at,text,public_metrics',
                "expansions": 'author_id,referenced_tweets.id',
                "user.fields": 'created_at,public_metrics',
                "max_results": '500',
                "start_time": '2020-01-01T00:00:00.000Z',
                "end_time": '2021-01-01T00:0:00.000Z',
            }

            if (lastMetaResponse[0]) {
                params["next_token"] = lastMetaResponse[0].next_token
            }

            const res = await needle('get', endpointUrl, params, {
                headers: {
                    "User-Agent": "v2RecentSearchJS",
                    "authorization": `Bearer ${token}`
                }
            })

            if (res.body) {
                resolve(res.body);
            } else {
                reject(new Error('Unsuccessful request'));
            }
        }, 2500);

    })
}

async function timeoutPromise(ms: number, promise: any) {
    return new Promise((resolve: (value: IResponse) => void, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error("promise timeout"))
        }, ms);
        promise.then(
            (res: IResponse) => {
                clearTimeout(timeoutId);
                resolve(res);
            },
            (err: any) => {
                clearTimeout(timeoutId);
                reject(err);
            }
        );
    })
}

export async function scan() {
    return new Promise(async (resolve, reject) => {
        try {

            // Make request
            while (true) {

                const response = await timeoutPromise(20000, getRequest());
                await addToDB(response)

            }


        } catch (e) {
            reject(e)
            console.log(e);
            // process.exit(-1);
        }
        resolve("Finished")
        process.exit();
    })
};

export async function groupingByDay() {
    return new Promise(async (resolve, reject) => {
        try {


            await Sentiment.aggregate([{
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$tweet_created_at" }
                    },
                    neg: { $avg: "$neg" },
                    neu: { $avg: "$neu" },
                    pos: { $avg: "$pos" },
                    compound: { $avg: "$compound" },
                }
            },
            { $out: "dailysentiments" }]).catch((error) => console.log(error))



            logger.log({
                level: 'silly',
                message: `Succesfully mapped and reduce sentiment by date`,
                consoleLoggerOptions: { label: 'CONSUMER' }
            });

        } catch (e) {
            reject(e)
            console.log(e);
            // process.exit(-1);
        }
        resolve("Finished")
        process.exit();
    })
};

export async function createPriceDbCollection() {
    cc.histoDay('BTC', 'USD', { timestamp: new Date('2020-12-31'), limit: 366 })
        .then(async (prices: any) => {
            await asyncForEach(prices, async (item: any) => {

                let priceObject = new Price({
                    time: new Date(item.time * 1000),
                    high: item.high,
                    low: item.low,
                    open: item.open,
                    volumefrom: item.volumefrom,
                    volumeto: item.volumeto,
                    close: item.close
                })
                await priceObject.save();
                logger.log({
                    level: 'silly',
                    message: `Succesfully saved price for date ${priceObject.time} to DB`,
                    consoleLoggerOptions: { label: 'CONSUMER' }
                });

            })

        })
        .catch(console.error)
}


// https://api.twitter.com/2/tweets/search/recent?query=(%23BTC)%20lang%3Aen%20since%3A2020-01-01&tweet.fields=created_at,text,lang,public_metrics&expansions=author_id&user.fields=created_at,public_metrics&max_results=10