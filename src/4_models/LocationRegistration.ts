import {model, Schema, Model, Document} from 'mongoose';
// want to encapsulate
interface ILocationRegistration extends Document {
  // todo encrypt the details
    regId: number;
    eventRegId: number;
    locationTime: Date;
    longtitude: number;
    latitude: number;
    racePointNumber : number;
    raceScore : number;
    finishTime : Date;
}

const LocationRegistrationSchema: Schema = new Schema({
    regId: { type: Number, required: true }, // "required", means that schema can be/must be validated
    eventRegId: { type: Number, required: true },
    locationTime: { type: Date, required: true },
    longtitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    racePointNumber: { type: Number, required: true },
    raceScore: { type: Number, required: true },
    finishTime: { type: Date, required: true },
});

const LocationRegistration: Model<ILocationRegistration> = model('LocationRegistration', LocationRegistrationSchema);

export {LocationRegistration,ILocationRegistration}