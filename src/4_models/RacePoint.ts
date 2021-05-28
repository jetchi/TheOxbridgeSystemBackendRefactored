import {model, Schema, Model, Document} from 'mongoose';
// want to encapsulate
interface IRacePoint extends Document {
  // todo encrypt the details
  racePointId: number;
  type: string;
  firstLongtitude : number;
  firstLatitude : number;
  secondLongtitude : number;
  secondLatitude : number;
  eventId: number;
  racePointNumber : number;
}

const RacePointSchema: Schema = new Schema({
    racePointId: { type: Number, required: true }, // "required", means that schema can be/must be validated
    type: { type: String, required: true },
    firstLongtitude: { type: Number, required: true },
    firstLatitude: { type: Number, required: true },
    secondLongtitude: { type: Number, required: true },
    secondLatitude: { type: Number, required: true },
    eventId: { type: Number, required: true },
    racePointNumber: { type: Number, required: true },
});

const RacePoint: Model<IRacePoint> = model('RacePoint', RacePointSchema);

export {RacePoint,IRacePoint}