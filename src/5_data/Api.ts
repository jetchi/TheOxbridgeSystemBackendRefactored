import { IShip } from "../4_models/Ship";
import { Ship } from "../4_models/Ship";
import { endpoints } from "../2_entities/endpoints";
import { IEvent } from "../4_models/Event";
import { Event } from "../4_models/Event";
import mongoose from "mongoose"; // ?
import { IImage, Image } from "../4_models/Image";
import { stringifyConfiguration } from "tslint/lib/configuration";
mongoose.set('useFindAndModify', false);

class Api{


    // ***IMAGE routes***

    // save image with shipID to DB
    static async saveImgDB(filename: string, contentType: string, imageBase64: string, shipId_img: number): Promise<boolean>{
        const newImage: IImage = new Image ({
        filename,
        contentType,
        imageBase64,
        shipId_img
        })

        await newImage.save();
        return true;
    }

    // returns all image objects from the DB
    static async getImages():Promise<any>{
        const images: IImage[] = await Image.find({},{_id:0,__v:0});
        return images;
    }

    // returns a single image object by a given shipid
    static async getImageByShipId(shipId_img: string):Promise<any>{
        const shipid_imgNo = Number(shipId_img);
        const query = {"shipId_img": shipid_imgNo}; // the field with the value I am looking for
        const projection = { // the fields of the object I want to display once its found
            "filename": 1,
            "contentType": 1,
            "imagebase64": 1,
            "shipId_img": 1
        }
        const demandedImage:IImage = await Image.findOne(query, projection); // finds the first object with the asked shipId_img
        return demandedImage;
    }

    // ***EVENT routes***

    static async createEvent(name: string, eventStart: Date, eventEnd: Date, city: string, eventCode: string, actualEventStart : Date, isLive:boolean): Promise<boolean>{

        // todo: check authorization, only if this is valid, do the things below to create a new event

        // find the last/highest ID
        const eventArray:Promise<IEvent[]> = await Api.getEvents();
        let highestEventId:number = 0;
        (await eventArray).forEach(event => { if (event.eventId > highestEventId) {
            highestEventId = event.eventId;
        }})
        // add +1 to the highest ID to create the new ID
        const eventId:number = Number(highestEventId) + 1;
        const newEvent: IEvent = new Event({
            eventId,
            name,
            eventStart,
            eventEnd,
            city,
            eventCode,
            actualEventStart,
            isLive,
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

static async getShipById(shipId:number):Promise<any>{
    const query = {"shipId": shipId}; // the field with the value I am looking for
    const projection = { // the fields of the object I want to display once its found
        "shipId": 1,
        "emailUsername": 1,
        "name": 1,
        "teamName": 1,
        "teamImage": 1,
    }
    const demandedShip:IShip = await Ship.findOne(query, projection);
    return demandedShip;
}

static async updateShip(shipId: number, name: string, teamName: string, teamImage:IImage):Promise<boolean>{
    const chosenShip: Promise<IShip> = Api.getShipById(shipId);
    console.log("is the chosenship found?: " + (await chosenShip).shipId + ' - ' + (await chosenShip).name);
    const query = {"shipId": shipId};
    const update = {"$set": { // the new ship object
        "name": name,
        "shipId": shipId,
        "teamName": teamName,
        "teamImage": teamImage
    }};
    const options = {"upsert": false}; // if the document to change cant be found, it will not insert a document with these params
    await Ship.updateOne(query, update, options);
    return true;
}

// ***USER ROUTES***
}
export {Api}