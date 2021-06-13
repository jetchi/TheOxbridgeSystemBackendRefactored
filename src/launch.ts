import {endpoints} from './2_entities/endpoints';

const port = process.env.PORT; // port 3000

const server = endpoints.listen(port, () =>{
    // console.log('Running in this mode: '+process.env.NODE_ENV);
    console.log('This server is listening at port:' + port);
} );