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
import path from "path";
import { IShip, Ship } from "../4_models/Ship";


dotenv.config({ path: 'config/_environment.env' });
const endpoints = express();

endpoints.use(cors());
endpoints.use(express.static('public'));
endpoints.use(bodyParser.json());

endpoints.use(bodyParser.urlencoded({extended: false}));

const storage = multer.diskStorage({ // file storage engine will tell multer how and where to store the files
  destination: (req, file, cb) => {
    cb(null, './src/uploads') // NB path!
  },
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.substr(file.originalname.lastIndexOf('.')); // will return the ".jpg" from a image.jpg
    cb(null, file.fieldname + '-' + Date.now() + fileExtension) // this is how the new name for the file is put together 8stored on the server in "uploads" folder)
  }
});

const upload = multer({storage}); // creating middleware

DB.connect(); // ask for connections


// get all images multer test 1 : in progress
// endpoints.get('/', (req, res) => {
//   Image.find({}, (err, items) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send(Message.cnap);
//     }
//     else {
//       res.render('imagesPage', { itmes: items});
//     }
//   });
// });

// upload an image to the server & DB using multer - works
endpoints.post('/images', upload.single("image"), async (req, res) => { // sending via postman: the key field in the body must equal "image"

  // Save the image in the DB as follows:

  const img = fs.readFileSync(req.file.path);
  // convert image into base64 encoding (data into ascii character set)
  const encode_image = img.toString('base64');

  try{
    const success:Promise<boolean> = Api.saveImgDB( // the info send within the request body by the client (like with postman)
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

 /*const obj = {
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
      res.redirect('/images');
    }
  })
  */

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
    const ship:Promise<IShip> = await Api.getShipById(Number(req.params.shipId));
    return res.status(200).json(ship);
  }catch(e){
    return res.status(400).json();
  }
})

// update a ship
endpoints.put('/ships', async (req, res) => {
  // TODO add check auth
  try{
      console.log("new name for the ship(sent in the body): " + req.body.name); // just for debugging purposes
      const success:Promise<boolean> = Api.updateShip(req.body.shipId, req.body.name, req.body.teamName, req.body.teamImage);
      return res.status(201).json({success});
  }catch(e){
      return res.status(400).json(Message.se);
  }
});

// ***USER ROUTES***

// *** "safety route" ***
// all other routes only GET, means you can only get data via the specified routes above.
endpoints.get('*', (req,res) =>{

    return res.status(400).json({});
  });

export {endpoints}