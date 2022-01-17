import { Request, RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';
import Sentiment from '../../models/Sentiment';

/**
 * Builds a mongoose query object to search sentiments according to sentiment name and author name.
 * @param name String containing the sentiment name or part of the sentiments name
 * @param author String containing the author name or part of the author's name
 */
const buildSentimentSeachQuery = (name?: string, author?: string): { [key: string]: any } => {
  const query: any = {};
  if (name) {
    query.name = new RegExp(`.*${name}.*`, 'i');
  }
  if (author) {
    query.author = new RegExp(`.*${author}.*`, 'i');
  }

  return query;
};

interface SearchReqBody {
  name?: string;
  author?: string;
}

const search: RequestHandler = async (req: Request<{}, {}, {}, SearchReqBody>, res) => {
  const { name, author } = req.query;

  const query = buildSentimentSeachQuery(name, author);
  const sentiments = await Sentiment.find(query);
  res.send({ sentiments });
};

export default requestMiddleware(search);
