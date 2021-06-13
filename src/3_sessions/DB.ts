import {connect} from 'mongoose';

export class DB{
  // a singleton:
  static async connect():Promise<void> {
        await connect(process.env.PATH_MONGODB, { // connection string is hidden in environment
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
}