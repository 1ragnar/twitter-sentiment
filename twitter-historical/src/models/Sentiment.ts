import { Model, Schema, model } from 'mongoose';
import { ISentiment } from './interfaces/Data';
import sentimentSchema from './sentiment.schema.json';

interface ISentimentModel extends Model<ISentiment> { }

const schema = new Schema<ISentiment>(sentimentSchema);

const Sentiment: ISentimentModel = model<ISentiment, ISentimentModel>('Sentiment', schema);

export default Sentiment;