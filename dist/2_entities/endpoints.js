"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.endpoints = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const bodyParser = __importStar(require("body-parser"));
const DB_1 = require("../3_sessions/DB");
const Api_1 = require("../5_data/Api");
const Message_1 = require("../5_data/Message");
const multer_1 = __importDefault(require("multer"));
const Image_1 = require("../4_models/Image");
const fs_1 = __importDefault(require("fs"));
dotenv.config({ path: 'config/_environment.env' });
const endpoints = express_1.default();
exports.endpoints = endpoints;
endpoints.use(cors_1.default());
endpoints.use(express_1.default.static('public'));
endpoints.use(bodyParser.json());
endpoints.use(bodyParser.urlencoded({ extended: false }));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads'); // NB path!
        /*
        '../uploads' - send it to upöoads in the new code folder -level too high
        './uploads' - error
        '/uploads' - error
        'uploads' - error
        './src/uploads' - yes!
        */
    },
    filename: (req, file, cb) => {
        const fileExtension = file.originalname.substr(file.originalname.lastIndexOf('.')); // will return the ".jpg" from a image.jpg
        cb(null, file.fieldname + '-' + Date.now() + fileExtension); // this is how the new name for the file is put together
    }
});
const upload = multer_1.default({ storage }); // creating middleware
DB_1.DB.connect(); // ask for connections
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
// upload an image to the server using multer - works
endpoints.post('/images', upload.single("image"), (req, res /*, next*/) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.file); //only for debug purp.
    // new start
    // convert image into base64 encoding (data into ascii character set)
    const img = fs_1.default.readFileSync(req.file.path);
    // console.log('what is the img?: ' + img); //only for debug purp.
    const encode_image = img.toString('base64');
    // console.log('how does the encode_image look like?: '+ encode_image); // ascii as expected -only for debug purp.
    // const result = (async () => {
    // console.log('test -goes into result?'); // yes -only for debug purp.
    const finalImg = {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        imageBase64: encode_image
    };
    console.log('test - creates finalImg?: ' + finalImg); // gives back "[object Object]" -only for debug purp.
    const newImage = new Image_1.Image(finalImg);
    try {
        yield newImage
            .save();
        console.log('the new image to store: ' + newImage); // also displays this -only for debug purp.
        return res.status(201).json({ msg: '${req.file.originalname} Image upload successfully!' });
    }
    catch (error) {
        if (error) {
            if (error.name === 'MongooseError' && error.code === 11000) { // means, if trying to upload a duplicate image
                return Promise.reject({ error: 'Duplicate ${req.file.originalname}. File Already Exists! ' });
            }
            return Promise.reject({ error: error.message || 'Cannot upload ${req.file.originalname} Something is missing!' });
        }
    }
    // });
    Promise.resolve()
        .then(msg => {
        res.json(msg);
    })
        .catch(err => {
        res.json(err);
    });
    // // new end
    //   res.send("single file upload to server success");
}));
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
endpoints.post('/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const success = Api_1.Api.createEvent(// the info send within the request body by the client (like with postman)
        // req.body.eventId, // the ID needs to be calculated and is not given by the user
        req.body.name, req.body.eventStart, req.body.eventEnd, req.body.city, req.body.eventCode, req.body.actualEventStart, req.body.isLive);
        return res.status(201).json({ success });
    }
    catch (e) {
        return res.status(400).json(Message_1.Message.se);
    }
}));
// retrieve and return all events from the database
endpoints.get('/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield Api_1.Api.getEvents();
    return res.status(200).json(events);
}));
// retrieve a single Event with eventId
endpoints.get('/events/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield Api_1.Api.getEventById(req.params.eventId);
        return res.status(200).json(event);
    }
    catch (e) {
        return res.status(400).json();
    }
}));
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
endpoints.get('/ships', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ships = yield Api_1.Api.getShips();
    return res.status(200).json(ships);
}));
// retrieve a single Ship with shipId
endpoints.get('/ships/:shipId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ship = yield Api_1.Api.getShipById(Number(req.params.shipId));
        return res.status(200).json(ship);
    }
    catch (e) {
        return res.status(400).json();
    }
}));
// update a ship
endpoints.put('/ships', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO add check auth
    try {
        console.log("new name for the ship(sent in the body): " + req.body.name); // just for debugging purposes
        const success = Api_1.Api.updateShip(req.body.shipId, req.body.name, req.body.teamName, req.body.teamImage);
        return res.status(201).json({ success });
    }
    catch (e) {
        return res.status(400).json(Message_1.Message.se);
    }
}));
// ***USER ROUTES***
// *** "safety route" ***
// all other routes only GET, means you can only get data via the specified routes above.
endpoints.get('*', (req, res) => {
    return res.status(400).json({});
});
//# sourceMappingURL=endpoints.js.map