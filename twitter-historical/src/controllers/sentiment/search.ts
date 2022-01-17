import { Request, RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';
import Sentiment from '../../models/Sentiment';

/**
 * Builds a mongoose query object to search sentiments according to tweet date of creation.
 * @param tweet_created_at Date when tweet is created
 */
const buildSentimentSeachQuery = (tweet_created_at: Date): { [key: string]: any } => {
  const query: any = {};
  if (tweet_created_at) {
    query.tweet_created_at = new RegExp(`.*${tweet_created_at}.*`, 'i');
  }


  return query;
};

interface SearchReqBody {
  tweet_created_at?: Date;
}

const search: RequestHandler = async (req: Request<{}, {}, {}, SearchReqBody>, res) => {
  const { tweet_created_at } = req.query;

  const query = buildSentimentSeachQuery(tweet_created_at);
  const sentiments = await Sentiment.find(query);
  res.send({ sentiments });
};

export default requestMiddleware(search);
