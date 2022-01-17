import { Request, RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';
import Tweet from '../../models/Tweet';

/**
 * Builds a mongoose query object to search tweets according to tweet name and author name.
 * @param name String containing the tweet name or part of the tweet's name
 * @param author String containing the author name or part of the author's name
 */
const buildTweetSeachQuery = (name?: string, author?: string): { [key: string]: any } => {
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

  const query = buildTweetSeachQuery(name, author);
  const tweets = await Tweet.find(query);
  res.send({ tweets });
};

export default requestMiddleware(search);
