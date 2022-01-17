import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import Meta from '../../models/Meta';

export const addMetaSchema = Joi.object().keys({
  next_token: Joi.string().required(),
  oldest_id: Joi.string().required(),
  newest_id: Joi.string().required(),
});

interface AddReqBody {
  next_token: string;
  oldest_id: string;
  newest_id: string
}

const add: RequestHandler = async (req: Request<{}, {}, AddReqBody>, res) => {
  const { next_token, oldest_id, newest_id } = req.body;

  const meta = new Meta({ next_token, oldest_id, newest_id });
  await meta.save();

  res.send({
    message: 'Saved',
    meta: meta.toJSON()
  });
};

export default requestMiddleware(add, { validation: { body: addMetaSchema } });
