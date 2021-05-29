import { IShip } from "../4_models/Ship";
import { Ship } from "../4_models/Ship";
import { endpoints } from "../2_entities/endpoints";
import { IEvent } from "../4_models/Event";
import { Event } from "../4_models/Event";
import mongoose from "mongoose"; // ?
mongoose.set('useFindAndModify', false);

class Api{


    // ***EVENT routes***

    static async createEvent(name: string, eventStart: Date, eventEnd: Date, city: string, eventCode: string, actualEventStart : Date): Promise<boolean>{

        // check authorization, only if this is valid, do the things below to create a new event

        // find the next event ID
        // 1) find the last/highest ID
        // 2)add +1 to the highest ID to make the new ID

        const eventArray:Promise<IEvent[]> = await Api.getEvents();
        let highestEventId:number = 0;
        (await eventArray).forEach(event => { if (event.eventId > highestEventId) {
            highestEventId = event.eventId;
        }})
        const eventId:number = Number(highestEventId) + 1;
        const newEvent: IEvent = new Event({
            eventId,
            name,
            eventStart,
            eventEnd,
            city,
            eventCode,
            actualEventStart,
            // isLive,
        });
        await newEvent.save();
        return true;
    }

    static async getEvents():Promise<any>{
        const events: IEvent[] = await Event.find({},{_id:0,__v:0});
        return events;
    }

    static async getEventById(eventId:string):Promise<any>{
        const uid_nr = Number(eventId);
        const query = {"eventId": uid_nr}; // the field with the value I am looking for
        const projection = { // the fields of the object I want to display once its found
            "eventId": 1,
            "name": 1,
            "eventStart": 1,
            "eventEnd": 1,
            "city": 1,
            "eventCode": 1,
            "actualEventStart": 1,
            "isLive": 1
        }
        const demandedEvent:IEvent = await Event.findOne(query, projection);
        return demandedEvent;
    }

// ***EVENTREGISTRATION ROUTES***

// ***LOCATIONREGISTRATION ROUTES***

// ***RACEPOINTS ROUTES***

// ***SHIP ROUTES***

static async getShips():Promise<any>{
    const ships: IShip[] = await Ship.find({},{_id:0,__v:0});
    return ships;
}

static async getShipById(shipId:string):Promise<any>{
    const uid_nr = Number(shipId);
    const query = {"shipId": uid_nr}; // the field with the value I am looking for
    const projection = { // the fields of the object I want to display once its found
        "shipId": 1,
        "emailUsername": 1,
        "name": 1,
        "teamName": 1,
        // "teamImage": 1,
    }
    const demandedShip:IShip = await Ship.findOne(query, projection);
    return demandedShip;
}

// static async updateShip(shipId:number, newShip:IShip):Promise<any> {
//     const filter = {shipId}; // shipId; //req.params.shipId
//     const update = new Ship(newShip);
//         // If you use Model.findOneAndUpdate(), by default you'll see a deprecation warning.
//         // Mongoose's findOneAndUpdate() long pre-dates the MongoDB driver's findOneAndUpdate() function, so it uses the MongoDB driver's findAndModify() function instead.
//         // You can opt in to using the MongoDB driver's findOneAndUpdate() function using the useFindAndModify global option.
//         // SEE above under imports "mongoose.set..."
//         // https://mongoosejs.com/docs/deprecations.html#findandmodify
//     const updatedShip:IShip = await Ship.findOneAndUpdate(filter, update, {
//         new: true
//         // returnOriginal: false // this will return the updated model, without this, it would by default return the "old" model from before the update.
//     });
//     return updatedShip;
// }



// ***USER ROUTES***
}
export {Api}