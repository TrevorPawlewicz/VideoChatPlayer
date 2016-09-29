// server.js = the entry into our application!!!!!!!!!!!!!!!!!
import "source-map-support/register";

import express from "express";
import http from "http";
import socketIo from "socket.io";

const isDevelopment = process.env.NODE_ENV !== "production";

//----------------------------------------------------------------------------
// SETUP:
const app = express();
const server = new http.Server(app);
const io = socketIo(server);

//----------------------------------------------------------------------------
// Client webpack


//----------------------------------------------------------------------------
// Configure Express
app.set("view engine", "jade");
app.use(express.static("publc"));

const useExternalStyles = isDevelopment;
// our only route:
app.get("/", (req, res) => {
    res.render("index", {
        useExternalStyles
    });
});

//----------------------------------------------------------------------------
// Modules



//----------------------------------------------------------------------------
// socket
io.on("connection", socket => {
    console.log(`===> Got connection from: ${socket.request.connection.remoteAddress}`);
});



//----------------------------------------------------------------------------
// startup
const port = process.env.PORT || 3000;
function startServer () {
    server.listen(port, () => {
        console.log(`===> Started http server on port: ${port}`);
    });
};

startServer();
//----------------------------------------------------------------------------
