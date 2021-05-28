"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const mongoose_1 = require("mongoose");
const ImageSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    img: {
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true },
    }
});
const Image = mongoose_1.model('Image', ImageSchema);
exports.Image = Image;
//# sourceMappingURL=Image.js.map