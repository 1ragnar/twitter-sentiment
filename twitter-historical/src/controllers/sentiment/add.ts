import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Sentiment from '../../models/Sentiment';

export const addSentimentSchema = Joi.object().keys({
  neg: Joi.number().required(),
  neu: Joi.number().required(),
  pos: Joi.number().required(),
  compound: Joi.number().required(),
  tweet_created_at: Joi.date().required()
});

interface AddReqBody {
  neg: number;
  neu: number;
  pos: number;
  compound: number;
  tweet_created_at: Date
}

const add: RequestHandler = async (req: Request<{}, {}, AddReqBody>, res) => {
  const { neg, neu, pos, compound, tweet_created_at } = req.body;

  const sentiment = new Sentiment({ neg, neu, pos, compound, tweet_created_at });
  await sentiment.save();

  res.send({
    message: 'Saved',
    sentiment: sentiment.toJSON()
  });
};

export default requestMiddleware(add, { validation: { body: addSentimentSchema } });
