import { Request, RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';
import Meta from '../../models/Meta';
import logger from '../../logger';

const get: RequestHandler = async (req: Request, res) => {
  const { metaId } = req.params;
  logger.silly(`Tweet to get: ${metaId}`);

  const tweet = await Meta.findById(metaId);
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
