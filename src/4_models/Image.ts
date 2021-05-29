import {model, Schema, Model, Document} from 'mongoose';
// want to encapsulate
// we are using an interface to make typescript aware of the properties ans data types we expect in our model instance
// an interface = a syntactical contract, that an entity should conform to (defines the shape of an object)
interface IImage extends Document {
  // todo encrypt the details
    name: string;
    desc: string;
    img: {
        data : Buffer;
        contentType : string;
    }
}

const ImageSchema: Schema = new Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    img: {
        data: { type: Buffer, required: true }, // allows us to store images as data in the form of arrays
        contentType: { type: String, required: true },
    }
});

const Image: Model<IImage> = model('Image', ImageSchema);

export {Image,IImage}