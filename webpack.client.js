var path              = require("path");
var wepack            = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const vendorModules = ["jquery"]; // need lodash??????????????????????????????

const dirname = path.resolve("./"); // work-around for webpack from server



function createConfig (isDebug) {
    const devTool = isDebug ? "eval-source-map" : "source-map";
    const plugins = [new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js")];

    const cssLoader = { test: /\.css$/, loader: "style!css" };
    const sassLoader = { test: /\.scss$/, loader: "style!css!sass" };
    const appEntry = ['./src/client/application.js']; // might load up diff files

    // IS production:
    if (!isDebug) {
        plugins.push(new webpack.optimize.UglifyJsPlugin());
        plugins.push(new ExtractTextPlugin("[name].css"));

        cssLoader.loader = ExtractTextPlugin.extract("style", "css");
        sassLoader.loader = ExtractTextPlugin.extract("style", "css!sass");
    }

    // return WEBPACK Config:---------------------------------------
    return {
        devtool: devTool,
        entry: {
            application: appEntry,
            vendor: vendorModules
        },
        output: {
            path: path.join(dirname, "public", "build"),
            filename: "[name].js",
            publicPath: "/build/"
        },
        resolve: {
            alias: {
                shared: path.join(dirname, "src", "shared")
            }
        },
        module: {
            loaders: [
                { test: /\.js$/ loader: "babel", exclude: /node_modules/ },
                { test: /\.js$/ loader: "eslint", exclude: /node_modules/ },
                { test: /\.(png|jpg|jpeg|gif|woff|tff|eot|svg|woff2)/,
                    loader: "url-loader?limit=1024" },
                cssloader,
                sassLoader
            ]
        }
    };
}; //--------------------------------------------------------------------------



module.exports = createConfig(true);
module.exports.create = createConfig;
