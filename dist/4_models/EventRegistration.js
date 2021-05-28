"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRegistration = void 0;
const mongoose_1 = require("mongoose");
const EventRegistrationSchema = new mongoose_1.Schema({
    eventRegId: { type: Number, required: true },
    shipId: { type: Number, required: true },
    eventId: { type: Number, required: true },
    trackColor: { type: String, required: true },
    teamName: { type: String, required: true },
});
const EventRegistration = mongoose_1.model('EventRegistration', EventRegistrationSchema);
exports.EventRegistration = EventRegistration;
//# sourceMappingURL=EventRegistration.js.map