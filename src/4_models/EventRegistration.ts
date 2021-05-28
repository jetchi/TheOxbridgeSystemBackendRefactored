import {model, Schema, Model, Document} from 'mongoose';
// want to encapsulate
interface IEventRegistration extends Document {
  // todo encrypt the details
  eventRegId: number;
  shipId : number;
  eventId : number;
  trackColor : string;
  teamName : string;
}

const EventRegistrationSchema: Schema = new Schema({
    eventRegId: { type: Number, required: true }, // "required", means that schema can be/must be validated
    shipId: { type: Number, required: true },
    eventId: { type: Number, required: true },
    trackColor: { type: String, required: true },
    teamName: { type: String, required: true },
});

const EventRegistration: Model<IEventRegistration> = model('EventRegistration', EventRegistrationSchema);

export {EventRegistration,IEventRegistration}