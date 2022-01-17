import { Model, Schema, model } from 'mongoose';
import { IMeta } from './interfaces/Data';
import metaSchema from './meta.schema.json';

interface IMetaModel extends Model<IMeta> { }

const schema = new Schema<IMeta>(metaSchema);

const Meta: IMetaModel = model<IMeta, IMetaModel>('Meta', schema);

export default Meta;