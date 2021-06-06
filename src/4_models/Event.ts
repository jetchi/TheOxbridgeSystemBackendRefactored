import {model, Schema, Model, Document} from 'mongoose';
// want to encapsulate
interface IEvent extends Document {
  // todo encrypt the details
    eventId: number;
    name: string;
    eventStart: Date;
    eventEnd: Date;
    city: string;
    eventCode: string;
    actualEventStart : Date;
    isLive : boolean;
}

const EventSchema: Schema = new Schema({
    eventId: { type: Number, required: true }, // "required", means that schema can be/must be validated
    name: { type: String, required: true },
    eventStart: { type: Date, required: true },
    eventEnd: { type: Date, required: true },
    city: { type: String, required: true },
    eventCode: { type: String, required: true },
    actualEventStart: { type: Date, required: false },
    isLive: { type: Boolean, required: false },
});

const Event: Model<IEvent> = model('Event', EventSchema);

export {Event,IEvent}
