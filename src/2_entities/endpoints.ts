import cors from "cors";
import express from "express";
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import { DB } from "../3_sessions/DB";
import { IEvent } from "../4_models/Event";
import { Api } from '../5_data/Api';
import { Message } from "../5_data/Message";

import multer from "multer";
import { Image } from "../4_models/Image"
import fs from "fs";
import path from "path";
import { IShip, Ship } from "../4_models/Ship";


dotenv.config({ path: 'config/_environment.env' });
const endpoints = express();
endpoints.use(cors());
endpoints.use(express.static('public'));
endpoints.use(bodyParser.json());

// added for multer test start
endpoints.use(bodyParser.urlencoded({extended: false}));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({storage});

// multer test end

DB.connect(); // ask for connections

// multer test 1 start
// get all images
endpoints.get('/', (req, res) => {
  Image.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send(Message.cnap);
    }
    else {
      res.render('imagesPage', { itmes: items});
    }
  });
});

// upload an image -
endpoints.post('/', upload.single('image'), (req, res, next) => {
  const obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(path.join(__dirname + '../uploads/' + req.file.filename)),
      contentType: 'image/png'
    }
  }
  Image.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    }
    else {
      item.save();
      res.redirect('/');
    }
  })
})
// multer test 1 end


// ***EVENT ROUTES***

// Create a new event
endpoints.post('/events', async (req, res) => { // change from this '/api/events'
  try{
    const success:Promise<boolean> = Api.createEvent( // the info send within the request body by the client (like with postman)
      // req.body.eventId, // the ID needs to be calculated and is not given by the user
      req.body.name,
      req.body.eventStart,
      req.body.eventEnd,
      req.body.city,
      req.body.eventCode,
      req.body.actualEventStart,
      // req.body.isLive // is this automatically sat to false when the even is created? look how ots done in website?
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
// Delete an Event with given eventId
// Updating event property "isLive" to true
// Updating event property "isLive" to false
// Checks if event with given eventId has a route
// Retrieve all events with participant corresponding to primarykey of user, supplied from the token

// ***EVENTREGISTRATION ROUTES***

// ***LOCATIONREGISTRATION ROUTES***

// ***RACEPOINTS ROUTES***

// ***SHIP ROUTES***

// retrieve and return all ships from the database
endpoints.get('/ships', async (req, res) => { // changed from this '/api/events'
  const ships:Promise<IShip[]> = await Api.getShips();
  return res.status(200).json(ships);
})

// retrieve a single Ship with shipId
endpoints.get('/ships/:shipId', async (req, res) => {
  try{
    const ship:Promise<IShip> = await Api.getShipById(req.params.shipId);
    return res.status(200).json(ship);
  }catch(e){
    return res.status(400).json();
  }
})

// update a ship
// endpoints.put('/ships/:shipId', async (req, res) => {

//   // TODO add check auth

//   // finding and updating the ship with the given shipId
//    try {
//     const updatedShip:Promise<IShip> = await Api.updateShip(Number(req.params.shipId), req.body);
//     return res.status(200).json(updatedShip);
//   }catch (e){
//     return res.status(400).json(Message.cnap);
//   }
// });

// ***USER ROUTES***

// *** "safety route" ***
// all other routes only GET, means you can only get data via the specified routes above.
endpoints.get('*', (req,res) =>{

    return res.status(400).json({});
  });

export {endpoints}