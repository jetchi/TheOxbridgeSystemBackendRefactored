import {model, Schema, Model, Document} from 'mongoose';
// want to encapsulate
interface IShip extends Document {
  // todo encrypt the details
    shipId: number;
    emailUsername: string;
    name: string;
    teamName: string; // new
    // teamImage: ?;
}

const ShipSchema: Schema = new Schema({
    shipId: { type: Number, required: true }, // "required", means that schema can be/must be validated
    emailUsername: { type: String, required: false },
    name: { type: String, required: true },
    teamName: { type: String, required: false },
    // teamImage?,
});

const Ship: Model<IShip> = model('Ship', ShipSchema);

export {Ship,IShip}