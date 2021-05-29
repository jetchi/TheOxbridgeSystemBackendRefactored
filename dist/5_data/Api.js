"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
const Ship_1 = require("../4_models/Ship");
const Event_1 = require("../4_models/Event");
const mongoose_1 = __importDefault(require("mongoose")); // ?
mongoose_1.default.set('useFindAndModify', false);
class Api {
    // ***EVENT routes***
    static createEvent(name, eventStart, eventEnd, city, eventCode, actualEventStart) {
        return __awaiter(this, void 0, void 0, function* () {
            // check authorization, only if this is valid, do the things below to create a new event
            // find the next event ID
            // 1) find the last/highest ID
            // 2)add +1 to the highest ID to make the new ID
            const eventArray = yield Api.getEvents();
            let highestEventId = 0;
            (yield eventArray).forEach(event => {
                if (event.eventId > highestEventId) {
                    highestEventId = event.eventId;
                }
            });
            const eventId = Number(highestEventId) + 1;
            const newEvent = new Event_1.Event({
                eventId,
                name,
                eventStart,
                eventEnd,
                city,
                eventCode,
                actualEventStart,
                // isLive,
            });
            yield newEvent.save();
            return true;
        });
    }
    static getEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            const events = yield Event_1.Event.find({}, { _id: 0, __v: 0 });
            return events;
        });
    }
    static getEventById(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid_nr = Number(eventId);
            const query = { "eventId": uid_nr }; // the field with the value I am looking for
            const projection = {
                "eventId": 1,
                "name": 1,
                "eventStart": 1,
                "eventEnd": 1,
                "city": 1,
                "eventCode": 1,
                "actualEventStart": 1,
                "isLive": 1
            };
            const demandedEvent = yield Event_1.Event.findOne(query, projection);
            return demandedEvent;
        });
    }
    // ***EVENTREGISTRATION ROUTES***
    // ***LOCATIONREGISTRATION ROUTES***
    // ***RACEPOINTS ROUTES***
    // ***SHIP ROUTES***
    static getShips() {
        return __awaiter(this, void 0, void 0, function* () {
            const ships = yield Ship_1.Ship.find({}, { _id: 0, __v: 0 });
            return ships;
        });
    }
    static getShipById(shipId) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid_nr = Number(shipId);
            const query = { "shipId": uid_nr }; // the field with the value I am looking for
            const projection = {
                "shipId": 1,
                "emailUsername": 1,
                "name": 1,
                "teamName": 1,
                // "teamImage": 1,
            };
            const demandedShip = yield Ship_1.Ship.findOne(query, projection);
            return demandedShip;
        });
    }
    static updateShip(shipId, newShip) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { shipId }; // shipId; //req.params.shipId
            const update = new Ship_1.Ship(newShip);
            // If you use Model.findOneAndUpdate(), by default you'll see a deprecation warning.
            // Mongoose's findOneAndUpdate() long pre-dates the MongoDB driver's findOneAndUpdate() function, so it uses the MongoDB driver's findAndModify() function instead.
            // You can opt in to using the MongoDB driver's findOneAndUpdate() function using the useFindAndModify global option.
            // SEE above under imports "mongoose.set..."
            // https://mongoosejs.com/docs/deprecations.html#findandmodify
            const updatedShip = yield Ship_1.Ship.findOneAndUpdate(filter, update, {
                new: true
                // returnOriginal: false // this will return the updated model, without this, it would by default return the "old" model from before the update.
            });
            return updatedShip;
        });
    }
}
exports.Api = Api;
//# sourceMappingURL=Api.js.map