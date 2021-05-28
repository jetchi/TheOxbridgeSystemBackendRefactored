"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRegistration = void 0;
const mongoose_1 = require("mongoose");
const LocationRegistrationSchema = new mongoose_1.Schema({
    regId: { type: Number, required: true },
    eventRegId: { type: Number, required: true },
    locationTime: { type: Date, required: true },
    longtitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    racePointNumber: { type: Number, required: true },
    raceScore: { type: Number, required: true },
    finishTime: { type: Date, required: true },
});
const LocationRegistration = mongoose_1.model('LocationRegistration', LocationRegistrationSchema);
exports.LocationRegistration = LocationRegistration;
//# sourceMappingURL=LocationRegistration.js.map