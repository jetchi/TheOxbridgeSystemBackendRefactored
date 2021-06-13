import { IShip } from "../4_models/Ship";
import { Ship } from "../4_models/Ship";
import { endpoints } from "../2_entities/endpoints";
import { IEvent } from "../4_models/Event";
import { Event } from "../4_models/Event";
import mongoose from "mongoose"; // ?
import { IImage, Image } from "../4_models/Image";
import { stringifyConfiguration } from "tslint/lib/configuration";
import { Message } from "./Message";
import { User, IUser } from "../4_models/User";
import { IRacePoint, RacePoint } from "../4_models/RacePoint";
import { EventRegistration, IEventRegistration } from "../4_models/EventRegistration";
import { isParenthesizedExpression, tokenToString } from "typescript";
import bcrypt from "bcrypt"; // install @types/bcrypt
import jwt from "jsonwebtoken"; // npm i --save-dev @types/jsonwebtoken
import { query } from "express";

mongoose.set('useFindAndModify', false); // DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete​()` without the `useFindAndModify` option set to false are deprecated.

class Api{

    // ***IMAGE routes***

    // save image with shipID to DB
    static async saveImgDB(filename: string, contentType: string, imageBase64: string, shipId_img: number): Promise<boolean>{
        const newImage: IImage = new Image ({
        filename,
        contentType,
        imageBase64,
        shipId_img
        });

        await newImage.save();
        return true;
    };

    // update image will change the image of an existing image with the given shipid
    static async updateImage(filename: string, contentType: string, imageBase64: string, shipId_img: number):Promise<boolean>{
        // const shipid_imgStr = String(shipId_img);
        // const chosenImage: Promise<IImage> = Api.getImageByShipId(shipid_imgStr);
        // console.log("is the chosenimage found?: " + (await chosenImage).shipId_img + ' - ' + (await chosenImage).filename);
        const query1 = {"shipId_img": shipId_img};
        const update = {"$set": { // the new image object
            "filename": filename,
            "contentType": contentType,
            "imageBase64": imageBase64,
            "shipId_img": shipId_img
        }};
        const options = {"upsert": false}; // if the document to change cant be found, it will not insert a new document with these params
        await Image.updateOne(query1, update, options);
        return true;
    };

    // returns all image objects from the DB
    static async getImages():Promise<any>{
        const images: IImage[] = await Image.find({},{_id:0,__v:0});
        return images;
    };

    // returns a single image object by a given shipid
    static async getImageByShipId(shipId_img: string):Promise<any>{
        const shipid_imgNo = Number(shipId_img);
        const query2 = {"shipId_img": shipid_imgNo}; // the field with the value I am looking for
        const projection = { // the fields of the object I want to display once its found
            "filename": 1,
            "contentType": 1,
            "imagebase64": 1,
            "shipId_img": 1
        };
        const demandedImage:IImage = await Image.findOne(query2, projection); // finds the first object with the asked shipId_img
        return demandedImage;
    };

    // ***EVENT routes***

    static async createEvent(name: string, eventStart: Date, eventEnd: Date, city: string, eventCode: string, actualEventStart : Date, isLive:boolean): Promise<boolean>{
        // todo : check authorization, only if this is valid, do the things below to create a new event
        // find the last/highest ID
        const eventArray:Promise<IEvent[]> = await Api.getEvents();
        let highestEventId:number = 0;
        (await eventArray).forEach(event => { if (event.eventId > highestEventId) {
            highestEventId = event.eventId;
        }});
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
    };

    static async getEvents():Promise<any>{
        const events: IEvent[] = await Event.find({},{_id:0,__v:0});
        return events;
    };

    static async getEventById(eventId:string):Promise<any>{
        const uid_nr = Number(eventId);
        const query3 = {"eventId": uid_nr}; // the field with the value I am looking for
        const projection = { // the fields of the object I want to display once its found
            "eventId": 1,
            "name": 1,
            "eventStart": 1,
            "eventEnd": 1,
            "city": 1,
            "eventCode": 1,
            "actualEventStart": 1,
            "isLive": 1
        };
        const demandedEvent:IEvent = await Event.findOne(query3, projection);
        return demandedEvent;
    };

    static async updateEvent(eventId: number, name: string, eventStart: Date, eventEnd: Date,
        city: string, eventCode: string, actualEventStart : Date, isLive : boolean):Promise<boolean>{
            // todo : check auth
            const query4 = {"eventId": eventId};
            const update = {"$set": { // the new event object
                "eventId": eventId,
                "name": name,
                "eventStart": eventStart,
                "eventEnd": eventEnd,
                "city": city,
                "eventCode": eventCode,
                "actualEventStart" : actualEventStart,
                "isLive" : isLive
                }
            };
        const options = {"upsert": false}; // if the document to change cant be found, it will not insert a document with these params
        await Event.updateOne(query4, update, options);
        return true;
    };

    // Updating event property "isLive" to true
    static async startEvent(eventId: string):Promise<IEvent>{
        // todo : check auth
        const eventToStart:IEvent = await Api.getEventById(eventId);
        const timestamp = new Date(); // creates a new date object with the current date and time
        const query5 = {"eventId": eventToStart.eventId};
        const update = {"$set": { // the new event object
            "eventId": eventToStart.eventId,
            "name": eventToStart.name,
            "eventStart": eventToStart.eventStart,
            "eventEnd": eventToStart.eventEnd,
            "city": eventToStart.city,
            "eventCode": eventToStart.eventCode,
            "actualEventStart" : timestamp,
            "isLive" : true
            }
        };
        const options = {"upsert": false}; // if the document to change cant be found, it will not insert a document with these params
        await Event.updateOne(query5, update, options);
        const startedEvent:IEvent = await Api.getEventById(eventId);
        return startedEvent;
    };

    // Updating event property "isLive" to false
    static async stopEvent(eventId: string):Promise<IEvent>{
        // todo : check auth
        const eventToStop:IEvent = await Api.getEventById(eventId);
        const query6 = {"eventId": eventToStop.eventId};
        const update = {"$set": { // the new event object
            "eventId": eventToStop.eventId,
            "name": eventToStop.name,
            "eventStart": eventToStop.eventStart,
            "eventEnd": eventToStop.eventEnd,
            "city": eventToStop.city,
            "eventCode": eventToStop.eventCode,
            "actualEventStart" : eventToStop.actualEventStart,
            "isLive" : false
            }
        };
        const options = {"upsert": false}; // if the document to change cant be found, it will not insert a document with these params
        await Event.updateOne(query6, update, options);
        const stopedEvent:IEvent = await Api.getEventById(eventId);
        return stopedEvent;
    };

    // Checks if event with given eventId has a route/competition track/racepoints
    static async hasRoute(eventId: string):Promise<boolean>{
        const eventId_no = Number(eventId);
        const racePointsOfEvent: IRacePoint[] = await RacePoint.find({"eventId": eventId_no},{_id:0,__v:0}); // {},{_id:0,__v:0}
        if (racePointsOfEvent.length === 0){
            console.log(racePointsOfEvent);
            return false;
        } else {
            return true;
        }
    };

    // todo : Retrieve all events with participant corresponding to primarykey of user, supplied from the token

    // Delete an event by Id
    static async deleteEvent(eventId: number):Promise<boolean>{
         // todo : check auth
        await Event.findOneAndRemove(({eventId}));
        return true;
    };

// ***EVENTREGISTRATION ROUTES***

// create and save a new EventRegistration
static async createEventRegistration(
    shipId : number,
    eventId : number,
    trackColor : string,
    teamName : string):Promise<IEventRegistration>{
        // todo : check auth
        // Find next eventRegId
        const eventRegArray:Promise<IEventRegistration[]> = await Api.getEventRegistrations();
        let highestEventRegId:number = 0;
        (await eventRegArray).forEach(eventRegistration => { if (eventRegistration.eventRegId > highestEventRegId) {
        highestEventRegId = eventRegistration.eventRegId;
        }})
        // add +1 to the highest ID to create the new ID
        const eventRegId:number = Number(highestEventRegId) + 1;
        const newEventReg: IEventRegistration = new EventRegistration({
            eventRegId,
            shipId,
            eventId,
            trackColor,
            teamName
        });
    await newEventReg.save();
    return newEventReg;
};

// retrieve all EventRegistrations from the database
static async getEventRegistrations():Promise<any>{
    const eventRegistrations: IEventRegistration[] = await EventRegistration.find({},{_id:0,__v:0});
    return eventRegistrations;
};

// retrieve all eventregistrations by the eventId
static async getEventRegistrationsByEventId(eventId:number):Promise<any>{
    const eventRegsOfEvent: IEventRegistration[] = await EventRegistration.find({"eventId": eventId});
    return eventRegsOfEvent;
};

// create a new eventRegistration/signUp ship for event (calls createEventRegistration above)
static async signUp(
    shipId : number,
    eventId : number,
    trackColor : string,
    teamName : string):Promise<IEventRegistration>{
        // TODO:check auth
        // checks if event code exists
        const eventId_str = String(eventId);
        const event:IEvent = await Api.getEventById(eventId_str);
        const ec:IEvent = await Event.findOne({"eventCode": event.eventCode});
        if (!ec){
            console.log("there is no event with such eventCode")
            return null;
        }else{
            // checks that ship is not already signed up to this event
            const evReg:IEventRegistration = await EventRegistration.findOne({
                "shipId": shipId,
                "eventId": eventId });
            if(evReg){
                console.log("This ship is already sigendUp for this event")
                return null;
            }else{
                // call create EventRegistration from above
                const registration = Api.createEventRegistration(
                    shipId, eventId, trackColor, teamName);
                return registration;
            }
        }
    };

    // TODO/in progress: get the participants of an event by eventId
    // static async getParticipants(eventId: string):Promise<any>{
    //     const eventId_No = Number(eventId)
    //     // find all registrations for this event
    //     const eventRegs:IEventRegistration[] = await Api.getEventRegistrationsByEventId(eventId_No);
    //     console.log("these are the eventRegs foud for the eventId: " + eventRegs); // test - works
    //     const partShips:IShip[] = [];
    //     // for each of the registrations, get the participating ship by shipId
    //     eventRegs.forEach( async eveReg => {
    //         const query = {"shipId": eveReg.shipId};
    //         const projection = {"shipId":1, "emailUsername":1, "name": 1, "teamName": 1  };
    //         const participatingShip:IShip = await Ship.findOne(query,projection);
    //         partShips.splice(0, 0, participatingShip); // adds the found participant at index , without removing objects from the array
    //     });
    //     console.log("partships: " + partShips);
    //     return partShips;
    // }

// TODO : ***LOCATIONREGISTRATION ROUTES***

// ***RACEPOINTS ROUTES***

// TODO : Retrieves start and finish racepoints from an given event

// Retrieves all racepoints from an given event
static async getRacePointsEvent(eventId: string):Promise<any>{
    const eventId_no = Number(eventId);
    const racePoints: IRacePoint[] = await RacePoint.find({"eventId": eventId_no},{_id:0,__v:0}, { sort: { racePointNumber: 1 }});
    return racePoints;
};

// ***SHIP ROUTES***

static async createShip(emailUsername: string, name: string, teamName: string):Promise<any>{
    // TODO : check auth
    // Find next shipId
    const shipArray:Promise<IShip[]> = await Api.getShips();
        let highestShipId:number = 0;
        (await shipArray).forEach(ship => { if (ship.shipId > highestShipId) {
            highestShipId = ship.shipId;
        }})
        // add +1 to the highest ID to create the new ID
        const shipId:number = Number(highestShipId) + 1;
        const newShip: IShip = new Ship({
            shipId,
            emailUsername,
            name,
            teamName
        });
        await newShip.save();
        return true;
};

static async getShips():Promise<any>{
    const ships: IShip[] = await Ship.find({},{_id:0,__v:0});
    return ships;
};

static async getShipById(shipId:number):Promise<any>{
    const query7 = {"shipId": shipId}; // the field with the value I am looking for
    const projection = { // the fields of the object I want to display once its found
        "shipId": 1,
        "emailUsername": 1,
        "name": 1,
        "teamName": 1
    }
    const demandedShip:IShip = await Ship.findOne(query7, projection);
    return demandedShip;
};

// TODO/in progress
// static async getUserShips(emailUsername:string):Promise<any>{
//     const ships: IShip[] = await Ship.find({emailUsername});
//     console.log(ships);
//     if(ships == null){
//         console.log('something went wrong, seems like no ships found for this user');

//     }
//     return ships;
// }

// TODO/in progress
// static async getShipsByEvent(eventId:number):Promise<any>{
//     const regs: IEventRegistration[] = await EventRegistration.find({"eventId": eventId});
//     const ships: IShip[];

//     regs.forEach(async reg => {
//         const regShipId = reg.shipId;

//         const foundShip: IShip = await Ship.findOne({"shipId": regShipId});

//         ships.splice(0, 0, foundShip);
//     })
//     return ships;
// }

static async updateShip(shipId: number, emailUsername: string, name: string, teamName: string):Promise<boolean>{
    const chosenShip: Promise<IShip> = Api.getShipById(shipId);
    // (if (shipId == null) {chosenShip.shipId} else {shipId})
    console.log("is the chosenship found?: " + (await chosenShip).shipId + ' - ' + (await chosenShip).name);
    const query8 = {"shipId": shipId};
    const update = {"$set": { // the new ship object
        "shipId": shipId,
        "emailUsername": emailUsername,
        "name": name,
        "teamName":  teamName
        }
    };
    const options = {"upsert": false}; // if the document to change cant be found, it will not insert a document with these params
    await Ship.updateOne(query8, update, options);
    return true;
};

// in progress
static async deleteShip(shipId: number):Promise<boolean>{
    await Ship.findOneAndRemove(({shipid: shipId}));
    return true;
};

// ***USER ROUTES***

static async getUsers():Promise<any>{
    const users: IUser[] = await User.find({},{_id:0,__v:0});
    return users;
};

// TODO/in progress : get a specific user by its emailUsername
// static async getSpecificUser(emailUsername:string):Promise<any>{
//     // TODO : check auth

//     // find user with the given emailUsername
//     const specUser: IUser = await User.findOne({ "emailUsername": emailUsername});
//     console.log("user found with this mail: " + specUser);

//     return specUser;
// }

// TODO/in progress: create user w. jwt
// static async registerUser(firstname: string, lastname: string, emailUsername: string, password: string):Promise<any>{
//     // check if user already exists
//     const userToCheck:IUser = await Api.getSpecificUser(emailUsername);
//     if(userToCheck){
//         console.log("sorry, a user with this email exits already");
//         return null;
//     }else{
//         // creating the user
//         const hashedPassword = bcrypt.hashSync(password, 10);
//         const role = "user";
//         const newUser:IUser = new User({
//             firstname,
//             lastname,
//             emailUsername,
//             hashedPassword,
//             role
//         });
//         await newUser.save();
//         const token = jwt.sign({ id: emailUsername, role: "user"}, "somesecret", {expiresIn: 86400});
//         return token;
//     }
// }

// creates a regular user
static async createUser(firstname: string, lastname: string, emailUsername: string, password: string):Promise<boolean>{
    // TODO :  check if user already exists
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log("the hashed password: " + hashedPassword);
    const role = "user";
    const newUser: IUser = new User({
        firstname,
        lastname,
        emailUsername,
        password : hashedPassword,
        role
    });
    await newUser.save();
    return true;
};

} export {Api}