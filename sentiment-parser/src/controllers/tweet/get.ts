import { Request, RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';
import Tweet from '../../models/Tweet';
import logger from '../../logger';

const get: RequestHandler = async (req: Request, res) => {
  const { tweetId } = req.params;
  logger.silly(`Tweet to get: ${tweetId}`);

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    return res.status(404).send({
      error: 'Tweet not found'
    });
  }

  return res.status(200).send({
    tweet: tweet.toJSON()
  });
};

export default requestMiddleware(get);
