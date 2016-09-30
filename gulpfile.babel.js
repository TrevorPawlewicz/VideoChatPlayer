import gulp from "gulp";
import webpack from "webpack";
import chalk from "chalk";
import rimraf from "rimraf";
import {create as createServerConfig} from "./webpack.server";
import {create as createClientConfig} from "./webpack.client";

const $ = require("gulp-load-plugins")();

console.log(`===> in the gulp.babel.js file!`);


// PUBLIC TASKS ---------------------------------------------------------------
gulp.task("clean:server", callback => rimraf("./build", callback));
gulp.task("clean:client", callback => rimraf("./public/build", callback));
gulp.task("clean", gulp.parallel("clean:server", "clean:client"));

// development
gulp.task("dev:server", gulp.series("clean:server", devServerBuild));
gulp.task("dev", gulp
    .series(
    "clean",
    devServerBuild,
    gulp.parallel(
        devServerWatch,
        devServerReload)));

// production
gulp.task("prod:server", gulp.series("clean:server", prodServerBuild));
gulp.task("prod:client", gulp.series("clean:client", prodClientBuild));
gulp.task("prod", gulp.series("clean", gulp.parallel(prodServerBuild, prodClientBuild)));

// PRIVATE CLIENT TASKS -------------------------------------------------------
function prodClientBuild (callback) {
    const compiler = webpack(createClientConfig(false));
    compiler.run((error, stats) => {
        outputWebpack("Prod:Client", error, stats);
        callback(); // gulp needs to be told we are done with task
    });
};


// PRIVATE SERVER TASKS -------------------------------------------------------
const devServerWebpack = webpack(createServerConfig(true));//from webpack.server.js export
const prodServerWebpack = webpack(createServerConfig(false));

// development
function devServerBuild (callback) {
    devServerWebpack.run((error, stats) => {
        outputWebpack("Dev:Server", error, stats);
        callback(); // gulp needs to be told we are done with task
    });
};
// development
function devServerWatch () {
    devServerWebpack.watch({}, (error, stats) => {
        outputWebpack("Dev:Server", error, stats);
    });
};
// development
function devServerReload () {
    return $.nodemon({
        script: "./build/server.js",
        watch: "./build",
        env: {
            "NODE_ENV": "development",
            "USE_WEBPACK": true
        }
    });
};

// production
function prodServerBuild (callback) {
    prodServerWebpack.run((error, stats) => {
        outputWebpack("Prod:Server", error, stats);
        callback(); // gulp needs to be told we are done with task
    });
};


// HELPERS --------------------------------------------------------------------
function outputWebpack (label, error, stats) {
    if (error) { throw new Error(error); }

    if (stats.hasErrors()) {
        $.util.log(stats.toString({colors: true}));
    } else {
        const time = stats.endTime - stats.startTime;
        $.util.log(chalk.bgGreen(`Built ${label} in ${time} ms!`));
    }
};
