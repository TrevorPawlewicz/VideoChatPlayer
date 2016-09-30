// server.js = the entry into our application!!!!!!!!!!!!!!!!!
import "source-map-support/register";

import express from "express";
import http from "http";
import socketIo from "socket.io";
import chalk from "chalk";
import {Observable} from "rxjs";

import {ObservableSocket} from "shared/observable-socket";

const isDevelopment = process.env.NODE_ENV !== "production";

//----------------------------------------------------------------------------
// SETUP:
const app = express();
const server = new http.Server(app);
const io = socketIo(server);

//----------------------------------------------------------------------------
// Client webpack
if (process.env.USE_WEBPACK === "true") {
    var webpackMiddleware = require("webpack-dev-middleware"),
        webpackHotMiddleware = require("webpack-hot-middleware"),
        webpack = require("webpack"),
        clientConfig = require("../../webpack.client");

    const compiler = webpack(clientConfig);
    app.use(webpackMiddleware(compiler, {
        publicPath: "/build/",
        stats: {
            colors: true,
            chunks: false,
            asstes: false,
            timings: false,
            modules: false,
            hash: false,
            version: false
        }
    }));
    app.use(webpackHotMiddleware(compiler));

    console.log(chalk.bgRed("Using WebPack Dev Middleware! FOR DEV ONLY!!!"));
}


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

    const client = new ObservableSocket(socket);

	for (let mod of modules) {
		mod.registerClient(client);
	}
	for (let mod of modules) {
		mod.clientRegistered(client);
    }
    // // test-o import:-----------------------------------------------------------
    // let index = 0;
    // setInterval(() => {
    //     socket.emit("test", `On Index ${index++} `);
    // }, 1000);
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
