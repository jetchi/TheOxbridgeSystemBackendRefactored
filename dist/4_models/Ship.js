"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ship = void 0;
const mongoose_1 = require("mongoose");
const ShipSchema = new mongoose_1.Schema({
    shipId: { type: Number, required: true },
    emailUsername: { type: String, required: true },
    name: { type: Number, required: true },
});
const Ship = mongoose_1.model('Ship', ShipSchema);
exports.Ship = Ship;
//# sourceMappingURL=Ship.js.map