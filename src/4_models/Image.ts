import {model, Schema, Model, Document} from 'mongoose';
// want to encapsulate
// we are using an interface to make typescript aware of the properties ans data types we expect in our model instance
// an interface = a syntactical contract, that an entity should conform to (defines the shape of an object)
interface IImage extends Document {
    // third version in progress
    // imageByteArray: Buffer, // todo check this
    // shipId: number,
    // imageName: string

    // second version, working from postman:
    filename: string,
    contentType: string,
    imageBase64: string,
    shipId_img: number

    // first version
    // imgName: string;
    // imgDescription: string;
    // img: {
    //     data : Buffer;
    //     contentType : string;
    // }
}

const ImageSchema: Schema = new Schema({
    // second version:
    filename: { type: String, required: true},
    contentType: {type: String, required: true},
    imageBase64: {type: String, required: true},
    shipId_img: {type: Number, required: true}

    // first version:
    // imgName: { type: String, required: true },
    // imgDescription: { type: String, required: true },
    // img: {
    //     data: { type: Buffer, required: true }, // allows us to store images as data in the form of arrays
    //     contentType: { type: String, required: true },
    // }
});

const Image: Model<IImage> = model('Image', ImageSchema); // this is where we specify that mongoose will create a collection inside the db called "Image", where the images are stored

export {Image,IImage}