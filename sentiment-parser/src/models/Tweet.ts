import { Model, Schema, model } from 'mongoose';
import { IExtendedTweet } from './interfaces/Data';
import tweetSchema from './tweet.schema.json';

interface ITweetModel extends Model<IExtendedTweet> { }

const schema = new Schema<IExtendedTweet>(tweetSchema);

const Tweet: ITweetModel = model<IExtendedTweet, ITweetModel>('Tweet', schema);

export default Tweet;