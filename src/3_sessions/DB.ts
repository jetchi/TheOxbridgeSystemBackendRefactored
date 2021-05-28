import {connect} from 'mongoose';
// only responbility for delivering the message?
export class DB{
  // a singleton:
  static async connect():Promise<void> {
        await connect(process.env.DB, { // connection string is hidden in environment
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
}