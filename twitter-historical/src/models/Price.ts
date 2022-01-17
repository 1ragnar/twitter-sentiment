import { Model, Schema, model } from 'mongoose';
import { IPrice } from './interfaces/Data';
import priceSchema from './price.schema.json';

interface IPriceModel extends Model<IPrice> { }

const schema = new Schema<IPrice>(priceSchema);

const Price: IPriceModel = model<IPrice, IPriceModel>('Price', schema);

export default Price;