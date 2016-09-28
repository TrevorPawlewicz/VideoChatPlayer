var path = require("path");

function createConfig (isDebug) {
    // return WEPACK Config:
    return {
        target: "node",
        devtool: "source-map",
        entry: "./src/server/server.js", // output file
        output: { // needs absolute path
            path: path.join(__dirname, "build"),
            filename: "server.js"
        },
        resolve: {
            alias: {
                shared: path.join(__dirname, "src", "shared") // shared folder
            }
        },
        module: {
            loaders: [ // how files are transformed
                { test: /\.js$/, loader: "babel", exclude: /node_modules/ },
                { test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/ }
            ]
        }

    };
}; // -------------------------------------------------------------------------













//--------------------------EXPORT---------------------------------------------
// export as a function
module.exports = createConfig(true); // WEBPACK expects an instance of an object
// export as a module
module.exports.create = createConfig; // create new copies of the config for us
