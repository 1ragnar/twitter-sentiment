import { Model, Schema, model } from 'mongoose';
import { IDailySentiment } from './interfaces/Data';
import sentimentSchema from './daily_sentiment.schema.json';

interface IDailySentimentModel extends Model<IDailySentiment> { }

const schema = new Schema<IDailySentiment>(sentimentSchema);

const DailySentiment: IDailySentimentModel = model<IDailySentiment, IDailySentimentModel>('DailySentiment', schema);

export default DailySentiment;