"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const mongoose_1 = require("mongoose");
const ImageSchema = new mongoose_1.Schema({
    // second version:
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    imageBase64: { type: String, required: true }
    // first version:
    // imgName: { type: String, required: true },
    // imgDescription: { type: String, required: true },
    // img: {
    //     data: { type: Buffer, required: true }, // allows us to store images as data in the form of arrays
    //     contentType: { type: String, required: true },
    // }
});
const Image = mongoose_1.model('Image', ImageSchema); // this is where we specify that mongoose will create a collection inside the db called "Image", where the images are stored
exports.Image = Image;
//# sourceMappingURL=Image.js.map