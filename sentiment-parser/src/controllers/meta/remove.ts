import { Request, RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';
import Sentiment from '../../models/Sentiment';

const remove: RequestHandler = async (req: Request, res) => {
  const { sentimentId } = req.params;

  const sentiment = await Sentiment.findById(sentimentId);
  if (!sentiment) {
    return res.status(404).send({
      error: 'Sentiment not found'
    });
  }

  await sentiment.delete();
  return res.status(204).send();
};

export default requestMiddleware(remove);
