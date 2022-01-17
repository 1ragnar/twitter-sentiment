import { Request, RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';
import Tweet from '../../models/Tweet';

const remove: RequestHandler = async (req: Request, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    return res.status(404).send({
      error: 'Tweet not found'
    });
  }

  await tweet.delete();
  return res.status(204).send();
};

export default requestMiddleware(remove);
