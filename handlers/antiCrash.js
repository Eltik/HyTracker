const config = require("../config/config.json");
const functions = require("../handlers/functions.js");

module.exports = client => {
    process.on('unhandledRejection', (reason, p) => {
        console.log('[ERROR] Unhandled Rejection/Catch'.red);
        console.error(reason, p);
    });
    process.on("uncaughtException", (err, origin) => {
        console.log('[ERROR] Uncaught Exception/Catch'.red);
        console.error(err, origin);
    })
    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log('[ERROR] Uncaught Exception/Catch (MONITOR)'.red);
        console.error(err, origin);
    });
    process.on('multipleResolves', (type, promise, reason) => {
        //console.log('[ERROR] Multiple Resolves'.red);
        //console.error(type, promise, reason);
        //functions.sendError(type + "\n\n" + promise + "\n\n" + reason, client.guilds, "Multiple Resolves");
    });
}

// Code credit to NiteBlock and Tofaa