import "./application.scss";
// import EVERY export:
import * as services from "./services";

//---------------------------
// test-o export:
services.server.on$("test")
    .map(d => d + "word")
    .subscribe(item => {
        console.log(`Got ${item} from server!`);
    });

services.server.status$
    .subscribe(status => console.log(status));
//---------------------------
// AUTH



//---------------------------
// Components




//---------------------------
// Bootstrap
services.socket.connect();
