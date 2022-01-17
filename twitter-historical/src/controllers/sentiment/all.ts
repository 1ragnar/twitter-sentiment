import { RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';
import Sentiment from '../../models/Sentiment';

const all: RequestHandler = async (req, res) => {
  const sentiments = await Sentiment.find();
  res.send({ sentiments });
};

export default requestMiddleware(all);
