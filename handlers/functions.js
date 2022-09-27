const config = require("../config/config.json");
const axios = require("axios");
const variables = require("./variables.js");
const channels = require("../config/channels.json");
const Discord = require("discord.js");

module.exports.isInDb = isInDb;
module.exports.insertUser = insertUser;
module.exports.removeUser = removeUser;
module.exports.getUsers = getUsers;
module.exports.getCurWins = getCurWins;
module.exports.getUUID = getUUID;
module.exports.getHypixel = getHypixel;
module.exports.runLoops = runLoops;
module.exports.logError = logError;

async function getHypixel(id) {
    return new Promise(async function (resolve, reject) {
        let uuidURL = `https://api.hypixel.net/player?uuid=${id}&key=${config.apiKey}`;
        axios.get(uuidURL, {
        }).then(async (res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        });
    });
}

async function getUUID(username) {
    return new Promise(async function (resolve, reject) {
        let uuidURL = "https://api.mojang.com/users/profiles/minecraft/" + username;
        axios.get(uuidURL, {
        }).then((res) => {
            resolve({ "name": res.data.name, "uuid": res.data.id })
        }).catch((err) => {
            reject(err);
        });
    });
}

function isInDb(id) {
    let isInDb = false;
    for (let i = 0; i < variables.curUsers.length; i++) {
        let curUser = variables.curUsers[i];
        let uuid = curUser[0];
        if (uuid === id) {
            isInDb = true;
        }
    }
    return isInDb;
}

function insertUser(uuid) {
    return new Promise(async function (resolve, reject) {
        getLastLogin(uuid).then((res) => {
            getLastLogout(uuid).then((ress) => {
                getHypixel(uuid).then((resss) => {
                    if (!res || !ress || !resss.player.displayname) {
                        resolve(false);
                    } else {
                        variables.curUsers.push([uuid, res, ress, resss.player.displayname]);
                        resolve(true);
                    }
                }).catch((err) => {
                    reject(false);
                })
            }).catch((err) => {
                reject(false);
            })
        }).catch((err) => {
            reject(false);
        })
    });
}

function removeUser(uuid) {
    let removed = false;
    for (let i = 0; i < variables.curUser.length; i++) {
        if (variables.curUser[i][0] === uuid) {
            variables.curUsers.splice(i, 1);
            removed = true;
        }
    }
    return removed;
}

function getUsers() {
    return variables.curUsers;
}

function getCurWins(id) {
    return new Promise(async function (resolve, reject) {
        let uuidURL = `https://api.hypixel.net/player?uuid=${id}&key=${config.apiKey}`;
        axios.get(uuidURL, {
        }).then(async (res) => {
            resolve(res.data.player.stats.Duels['bridge_duel_wins']);
        }).catch((err) => {
            reject(err);
        });
    });
}

function getLastLogin(id) {
    return new Promise(async function (resolve, reject) {
        let uuidURL = `https://api.hypixel.net/player?uuid=${id}&key=${config.apiKey}`;
        axios.get(uuidURL, {
        }).then(async (res) => {
            resolve(res.data.player.lastLogin);
        }).catch((err) => {
            reject(err);
        });
    });
}

function getLastLogout(id) {
    return new Promise(async function (resolve, reject) {
        let uuidURL = `https://api.hypixel.net/player?uuid=${id}&key=${config.apiKey}`;
        axios.get(uuidURL, {
        }).then(async (res) => {
            resolve(res.data.player.lastLogout);
        }).catch((err) => {
            reject(err);
        });
    });
}

function runLoops(guild) {
    setInterval(function () {
        for (let i = 0; i < variables.curUsers.length; i++) {
            getLastLogin(variables.curUsers[i][0]).then((res) => {
                variables.curUsers[i][1] = res;
                getLastLogout(variables.curUsers[i][0]).then((ress) => {
                    variables.curUsers[i][2] = ress;
                    if (res > ress) {
                        const user = variables.curUsers[i][0];
                        getHypixel(user).then(res => {
                            let dateString = Date.now().toString();
                            const trackedEmbed = new Discord.EmbedBuilder()
                                .setColor('#36699c')
                                .setTitle("`" + res.player.displayname + "` has logged in!")
                                .setDescription("Logged in <t:" + dateString.substring(0, dateString.length - 3) + ":R>.")
                                .setFooter({ "text": "They have been removed from the tracking cache." })
                                .setTimestamp();
                            guild.channels.cache.get(channels.trackedChannel).send({ embeds: [trackedEmbed] });
                        }).catch(err => {
                            console.error(err);
                            const trackedEmbed = new Discord.EmbedBuilder()
                                .setColor('#a84040')
                                .setDescription("An error occurred trying to fetch `" + user + "`.")
                                .setTimestamp();
                            guild.channels.cache.get(channels.trackedChannel).send({ embeds: [trackedEmbed] });
                        })
                        variables.curUsers.splice(i, 1);
                    }
                })
            })
        }
    }, 1000);
}

function logError(message) {
    let day = new Date().getDate();
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let hours = new Date().getHours() + 1;
    let minutes = new Date().getMinutes() + 1;
    let seconds = new Date().getSeconds() + 1;
    let time =
        month.toString() +
        "/" +
        day.toString() +
        "/" +
        year.toString() +
        "[" +
        hours +
        ":" +
        minutes +
        ":" +
        seconds +
        "]";

    // Write to the file
    let logFile = fs.createWriteStream("./errors/error.log", { flags: "a" });

    // If the message to log doesn't exist...
    if (!message) {
        logFile.write(
            util.format("[" + time + "] " + "Could not get message.") + "\n"
        );
    } else {
        // Add the time stamp to the message
        logFile.write(util.format("[" + time + "] " + message) + "\n");
    }
}