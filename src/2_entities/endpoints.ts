import cors from "cors";
import express from "express";
import * as dotenv from 'dotenv';
import * as bodyParser from "body-parser";
import { DB } from "../3_sessions/DB";
import { IEvent } from "../4_models/Event";
import { Api } from '../5_data/Api';
import { Message } from "../5_data/Message";

import multer from "multer";
import { IImage, Image } from "../4_models/Image"
import fs from "fs";
import { IShip, Ship } from "../4_models/Ship";
import { IUser } from "../4_models/User";
import { IRacePoint } from "../4_models/RacePoint";
import { IEventRegistration } from "../4_models/EventRegistration";
import { Token } from "typescript";

dotenv.config({ path: 'config/_environment.env' });
const endpoints = express();

endpoints.use(cors());
endpoints.use(express.static('public'));
endpoints.use(bodyParser.json());
endpoints.use(bodyParser.urlencoded({extended: false}));

// create a file storage engine. It will tell multer how and where to store the files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/uploads') // NB path!
  },
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.substr(file.originalname.lastIndexOf('.')); // will return the ".jpg" from an image.jpg
    cb(null, file.fieldname + '-' + Date.now() + fileExtension) // this is how the new name for the file is put together & stored on the server in "uploads" folder
  }
});

// creating middleware multer
const upload = multer({
  storage,
  limits: { fieldSize: 25 * 1024 * 1024 } // sets the file size allowed for upload
});

DB.connect(); // ask for connections

// ***IMAGE ROUTES***

// get all images
endpoints.get('/images', async (req, res) => {
  const images:Promise<IImage[]> = await Api.getImages();
  return res.status(200).json(images);
});

// retrieve a single Image with shipId
endpoints.get('/images/:shipId_img', async (req, res) => {
  try{
    const demandedImage:Promise<IImage> = await Api.getImageByShipId(req.params.shipId_img);
    return res.status(200).json(demandedImage);
  }catch(e){
    return res.status(400).json(e);
  }
});

// upload an image to the server & DB using multer
endpoints.post('/images', upload.single("image"), async (req, res) => { // obs: sending via postman -> the key field in the body must equal "image"
  // Save the image in the DB as follows:
  console.log('path of img: ' + req.file.path); // path of img: src\uploads\image-1623070185453.jpg
  const img = fs.readFileSync(req.file.path);

  // convert image into base64 encoding (data into ascii character set)
  const encode_image = img.toString('base64');

  // check if there is an image with this shipId_img already (does the ship/team already have an image?)
  // If so, call the put(update) method for the corresponding image, instead of inserting a new image with the same shipId
  // this ensures, that there is only one image pr ship/team stored at a time
  const demandedImage:Promise<IImage> = await Api.getImageByShipId(req.body.shipId_img);
  try{
    if (demandedImage != null){
      console.log('there is an image for this ship/team already, it will now be replaced: ' + (await demandedImage).filename);
      const success:Promise<boolean> = Api.updateImage(
        req.file.originalname,
        req.file.mimetype,
        encode_image,
        req.body.shipId_img
      );
      return res.status(201).json({success});
    }else{
      const success:Promise<boolean> = Api.saveImgDB( // the info send within the request body by the client (like with postman)
      req.file.originalname,
      req.file.mimetype,
      encode_image,
      req.body.shipId_img
    );
    return res.status(201).json({success});
    }
  }catch(e){
    return res.status(400).json(Message.se);
  }
});

endpoints.put('/images', upload.single("image"), async (req, res) => {

  try{
    const img = fs.readFileSync(req.file.path);
    // convert image into base64 encoding (data into ascii character set)
    const encode_image = img.toString('base64');
    const success:Promise<boolean> = Api.updateImage(
      req.file.originalname,
      req.file.mimetype,
      encode_image,
      req.body.shipId_img
    );
    return res.status(201).json({success});
  }catch(e){
      return res.status(400).json(Message.se);
  }
});


// ***EVENT ROUTES***

// Create a new event
endpoints.post('/events', async (req, res) => {
  try{
    const success:Promise<boolean> = Api.createEvent( // the info send within the request body by the client (like with postman)
      // req.body.eventId, // the ID needs to be calculated and is not given by the user
      req.body.name,
      req.body.eventStart,
      req.body.eventEnd,
      req.body.city,
      req.body.eventCode,
      req.body.actualEventStart,
      req.body.isLive,
      );
      return res.status(201).json({success});
  }catch(e){
    return res.status(400).json(Message.se);
  }
});

// retrieve and return all events from the database
endpoints.get('/events', async (req, res) => { // changed from this '/api/events'
    const events:Promise<IEvent[]> = await Api.getEvents();
    return res.status(200).json(events);
})

// retrieve a single Event with eventId
endpoints.get('/events/:eventId', async (req, res) => {
  try{
    const event:Promise<IEvent> = await Api.getEventById(req.params.eventId);
    return res.status(200).json(event);
  }catch(e){
    return res.status(400).json();
  }
})

// Update an Event with given eventId
endpoints.put('/events/:eventId', async (req, res) => {
  try{
    const success:Promise<boolean> = Api.updateEvent(
      req.body.eventId,
      req.body.name,
      req.body.eventStart,
      req.body.eventEnd,
      req.body.city,
      req.body.eventCode,
      req.body.actualEventStart,
      req.body.isLive);
    return res.status(201).json({success});
}catch(e){
    return res.status(400).json(Message.se);
}
});

  // Updating event property "isLive" to true
endpoints.put('/events/startEvent/:eventId', async (req, res) => {
try{
  const startedEvent:IEvent = await Api.startEvent(req.params.eventId);
  return res.status(201).json(startedEvent);
}catch(e){
  return res.status(400).json(Message.se);
}
});

  // Updating event property "isLive" to false
  endpoints.put('/events/stopEvent/:eventId', async (req, res) => {
  try{
    const stopedEvent:IEvent = await Api.stopEvent(req.params.eventId);
    return res.status(201).json(stopedEvent);
  }catch(e){
    return res.status(400).json(Message.se);
  }
  });

  // Checks if event with given eventId has racepoints/ a planed competition track
  endpoints.get('/events/hasRoute/:eventId', async (req, res) => {
    try{
      const hasRoute = await Api.hasRoute(req.params.eventId);
      return res.status(201).json(hasRoute);
    }catch(e){
      return res.status(400).json(Message.se);
    }
  });

  // TODO : Retrieve all events with participant corresponding to primarykey of user, supplied from the token

  // Delete an Event with given eventId
  endpoints.delete('/events/:eventId', async (req, res) => {
    try{
      const success:Promise<boolean> = Api.deleteEvent(req.body.eventId);
      return res.status(201).json({success});
  }catch(e){
      return res.status(400).json(Message.se);
  }
  });

// ***EVENTREGISTRATION ROUTES***

  // Create and save a new EventRegistration
  endpoints.post('/eventRegistrations/', async (req, res) => {
    try{
      const eventRegistration:Promise<IEventRegistration> = Api.createEventRegistration(
        // req.body.eventRegId,
        req.body.shipId,
        req.body.eventId,
        req.body.trackColor,
        req.body.teamName
        );
        return res.status(201).json({eventRegistration});
    }catch(e){
      return res.status(400).json(Message.se);
    }
  })

  // Retrieve all EventRegistrations
  endpoints.get('/eventRegistrations/', async (req, res) =>{
    const eventRegistrations:Promise<IEventRegistration[]> = await Api.getEventRegistrations();
    return res.status(200).json(eventRegistrations);
  })

  // TODO: Retrieve all EventRegistrations with ship that is owned by user registrered on token

  // Create an EventRegistration (signUp ship for event)
  endpoints.post('/eventRegistrations/signUp', async (req, res) => {
    try{
      const eventRegistration:Promise<IEventRegistration> = Api.signUp(
      // req.body.eventRegId,
      req.body.shipId,
      req.body.eventId,
      req.body.trackColor,
      req.body.teamName
      );
      return res.status(201).json({eventRegistration});
  }catch(e){
    return res.status(400).json(Message.se);
  }
  })

  // TODO: Delete an EventRegistration with given eventRegId
  // TODO: Creates an EventRegistration

  // TODO/in progress: Retrieve all EventRegistrations with the given eventId (get Participants)
  // endpoints.get('/eventRegistrations/getParticipants/:eventId', async (req, res) => {
  //   try{
  //     const participants:Promise<IShip[]> = await Api.getParticipants(req.params.eventId); // added await
  //     return res.status(201).json({participants});
  //   }catch(e){
  //     return res.status(400).json(Message.se);
  //   }
  // })

  // TODO: Update EventRegistration

// ***LOCATIONREGISTRATION ROUTES***

  // TODO: Create a new LocationRegistration
  // TODO: Retrieve latest LocationRegistrations from specified event
  // TODO: Retrieve all LocationRegistrations from specified event
  // TODO: Retrieve scoreboard from specific event
  // TODO: Delete all locationRegistrations with a given eventRegId

// ***RACEPOINTS ROUTES***

    // TODO : Retrieve start and finish racepoints from an specific event
    // endpoints.get('/racePoints/findStartAndFinish/:eventId', async (req, res) => {
    // });

    // Retrieve all racepoints from a specific event
    endpoints.get('/racepoints/fromEventId/:eventId', async (req, res) => {
      const racePoints:Promise<IRacePoint[]> = await Api.getRacePointsEvent(req.params.eventId);
      return res.status(200).json(racePoints);
    });

    // TODO : Creates a new route of racepoints for an event
    // endpoints.get('/racepoints/createRoute/:eventId', async (req, res) => {
    // });

// ***SHIP ROUTES***

// create a new ship
endpoints.post('/ships', async (req, res) => {
  try{
    const success:Promise<boolean> = Api.createShip(
        // req.body.shipId, // the ID needs to be calculated and is not given by the user
        req.body.emailUsername,
        req.body.name,
        req.body.teamName
      );
      return res.status(201).json({success});
  }catch(e){
    return res.status(400).json(Message.se);
  }
})

// retrieve and return all ships from the database
endpoints.get('/ships', async (req, res) => { // changed from this '/api/events'
  const ships:Promise<IShip[]> = await Api.getShips();
  return res.status(200).json(ships);
});

// retrieve a single Ship with shipId
endpoints.get('/ships/:shipId', async (req, res) => {
  try{
    const ship:Promise<IShip> = await Api.getShipById(Number(req.params.shipId));
    return res.status(200).json(ship);
  }catch(e){
    return res.status(400).json();
  }
});

// TODO/in progress : retrieving all user ships
// endpoints.get('/ships/myShips/:emailUsername', async (req, res) => { // does it work with an @ sign and dot in the route?

//   // todo : check auth

//   try{
//     const userShips:Promise<IShip[]> = await Api.getUserShips(req.body.emailUsername);
//     return res.status(201).json(userShips);
//   }catch(e){
//     return res.status(400).json(Message.se);
// }
// });

// TODO/in progress : retrieve all ships participating in the given event
// endpoints.get('/ships/fromEventId/:eventId', async (req, res) => {
//   try{
//     const ships:Promise<IShip[]> = await Api.getShipsByEvent(Number(req.params.eventId));
//     return res.status(200).json(ships);
//   }catch(e){
//     return res.status(400).json();
//   }
// })

// update a ship
endpoints.put('/ships', async (req, res) => {
  // TODO add check auth
  try{
      console.log("new name for the ship(sent in the body): " + req.body.name); // just for debugging purposes
      const success:Promise<boolean> = Api.updateShip(
        req.body.shipId,
        req.body.emailUsername,
        req.body.name,
        req.body.teamName
        );
      return res.status(201).json({success});
  }catch(e){
      return res.status(400).json(Message.se);
  }
});

// delete a ship
endpoints.delete('/ships/:shipId', async (req, res) => {
  // todo : check auth
  try{
    const success:Promise<boolean> = Api.deleteShip(req.body.shipId);
    return res.status(201).json({success});
  }catch(e){
    return res.status(400).json(Message.se);
}
});

// ***USER ROUTES***

  // Retrieve all Users
  endpoints.get('/users', async (req, res) => { // changed from this '/api/events'
    const users:Promise<IUser[]> = await Api.getUsers();
    return res.status(200).json(users);
  });

  // TODO/in progress : Retrieve a single User with the given emailUsername
  // endpoints.get('/users/:userName', async (req, res) => {
  //   try{
  //     console.log("what is in the params string? : " + req.params.emailUsername);
  //     const demandedUser:Promise<IUser> = await Api.getSpecificUser(req.params.emailUsername);
  //     return res.status(200).json(demandedUser);
  //   }catch(e){
  //     return res.status(400).json();
  //   }
  // })

  // TODO : Update a User with the given emailUsername

  // TODO : Delete a User with the given emailUsername

  // TODO : Register a new admin

  // TODO/in progress : Register a new user w. token
  // endpoints.post('/users/register', async (req, res) => {
  //   try{
  //     console.log("goes into the post user method of endpoints...");
  //     const token = await Api.registerUser(req.body.firstname, req.body.lastname, req.body.emailUsername, req.body.password);
  //     return res.status(200).json({token});
  //   }catch(e){
  //     return res.status(400).json(Message.se);
  //   }
  // })

// register a new user, returning true/false for success => to be used by the flutter app
 endpoints.post('/users/register', async (req, res) => {
  try{
    const success:Promise<boolean> = Api.createUser(
      req.body.firstname,
      req.body.lastname,
      req.body.emailUsername,
      req.body.password
    );
      return res.status(201).json({success});
  }catch(e){
    return res.status(400).json(Message.se);
  }
 })

// TODO : Login

// *** "safety route" ***
// all other routes only GET, means you can only get data via the specified routes above.
endpoints.get('*', (req,res) =>{

    return res.status(400).json({});
  });

export {endpoints}