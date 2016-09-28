var path    = require("path");
var fs      = require("fs");
var webpack = require("webpack");

//                                filter out all the .bin from nod_modules
const nodeModules = fs.readdirSync("./node_modules").filter(d => d != ".bin");
function ignoreNodeModules (context, req, callback) {
    // relative paths will be included "./..."
    if (req[0] == ".") { return callback(); }

    const module = req.split("/")[0];

    // get module name
    if (nodeModules.indexOf(module) !== -1) {
        // make it a normal require
        return callback(null, "commonjs " + req);
    }

    return callback();
}; //--------------------------------------------------------------------------

function createConfig (isDebug) {
    const plugins = [];

    if (!isDebug) {
        plugins.push(new webpack.optimize.UglifyJsPlugin());
    }
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
                {test: /\.js$/, loader: "babel", exclude: /node_modules/},
                {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
            ]
        },
        externals: [ignoreNodeModules],
        plugins: plugins
    };
}; // -------------------------------------------------------------------------

//--------------------------EXPORT---------------------------------------------
// export as a function
module.exports = createConfig(true); // WEBPACK expects an instance of an object
// export as a module
module.exports.create = createConfig; // create new copies of the config for us
