import { endpoints } from "../2_entities/endpoints";
import { IEvent } from "../4_models/Event";
import { Event } from "../4_models/Event";

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

    static async getEventById(uid:string):Promise<any>{
        const uid_nr = Number(uid);
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

// ***USER ROUTES***
}
export {Api}