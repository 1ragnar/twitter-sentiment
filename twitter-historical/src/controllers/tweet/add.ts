import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Tweet from '../../models/Tweet';

export const addTweetSchema = Joi.object().keys({
  name: Joi.string().required(),
  author: Joi.string().required()
});

interface AddReqBody {
  name: string;
  author: string;
}

const add: RequestHandler = async (req: Request<{}, {}, AddReqBody>, res) => {
  const { name, author } = req.body;

  const tweet = new Tweet({ name, author });
  await tweet.save();

  res.send({
    message: 'Saved',
    tweet: tweet.toJSON()
  });
};

export default requestMiddleware(add, { validation: { body: addTweetSchema } });
