import { Request, RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';
import Sentiment from '../../models/Sentiment';
import logger from '../../logger';

const get: RequestHandler = async (req: Request, res) => {
  const { sentimentId } = req.params;
  logger.silly(`Tweet to get: ${sentimentId}`);

  const sentiment = await Sentiment.findById(sentimentId);
  if (!sentiment) {
    return res.status(404).send({
      error: 'Sentiment not found'
    });
  }

  return res.status(200).send({
    sentiment: sentiment.toJSON()
  });
};

export default requestMiddleware(get);
