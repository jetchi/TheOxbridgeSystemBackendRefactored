import {model, Schema, Model, Document} from 'mongoose';
// want to encapsulate
interface IUser extends Document {
  // todo encrypt the details
  firstname: string;
  lastname: string;
  emailUsername: string;
  password: string;
  role: string;
}

const UserSchema: Schema = new Schema({
    firstname: { type: String, required: true }, // "required", means that schema can be/must be validated
    lastname: { type: String, required: true },
    emailUsername: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
});

const User: Model<IUser> = model('User', UserSchema);

export {User,IUser}