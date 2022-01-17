import { RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';
import Tweet from '../../models/Tweet';

const all: RequestHandler = async (req, res) => {
  const tweets = await Tweet.find();
  res.send({ tweets });
};

export default requestMiddleware(all);
