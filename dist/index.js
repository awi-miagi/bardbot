"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const ConfigFile = require("./config");
const KeyFile = require("./keys");
var bodyParser = require('body-parser');
var axios = require('axios');
const GuildModel = require('./models/Guild');
const RSSFeedModel = require('./models/RSSFeed');
const TwitchModel = require('./models/TwitchStream');
const mongoose = require('mongoose');
let Parser = require('rss-parser');
let parser = new Parser();
const rssCheckTime = 5 * 60 * 1000;
const twitchCheckTime = 60 * 1000;
const client = new Discord.Client();
let commands = [];
let devmode = 0;
(() => __awaiter(void 0, void 0, void 0, function* () {
    let connString = "";
    if (devmode == 0) {
        connString = `mongodb://${KeyFile.key.dbusername}:${KeyFile.key.dbpassword}@localhost/${KeyFile.key.db}?authSource=${KeyFile.key.dbauthsource}`;
    }
    else {
        connString = `mongodb://${KeyFile.key.dbusername}:${KeyFile.key.dbpassword}@${KeyFile.key.dbaddress}/${KeyFile.key.db}?authSource=${KeyFile.key.dbauthsource}`;
    }
    yield mongoose.connect(connString, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    return client.login(KeyFile.key.bottoken)
        .catch(console.error);
}))();
function parseRSSFeeds() {
    return __awaiter(this, void 0, void 0, function* () {
        let allFeeds = yield RSSFeedModel.find({});
        let newItems = [];
        allFeeds.forEach(function (dbItems) {
            return __awaiter(this, void 0, void 0, function* () {
                var dbDate = new Date(dbItems.latestDate);
                let oldFeedItems = dbItems.feedItems;
                parser.parseURL(dbItems.feedUrl, function (err, feed) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (err)
                            console.log(err);
                        feed.items.forEach(function (entry) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (entry.link) {
                                    var entryDate = new Date(entry.isoDate);
                                    if (entryDate >= dbDate) {
                                        let dupCheck = yield RSSFeedModel.findOne({ "feedUrl": dbItems.feedUrl, "feedItems.itemLink": entry.link });
                                        if (dupCheck)
                                            return;
                                        oldFeedItems.push({ "itemTitle": entry.title, "itemLink": entry.link, "itemDate": entry.isoDate });
                                        let currDate = new Date();
                                        yield RSSFeedModel.findOneAndUpdate({ "feedUrl": dbItems.feedUrl }, { $set: { "feedItems": oldFeedItems, "latestDate": currDate } }, { new: true });
                                        let guildsCheck = yield GuildModel.find({ "rssfeeds.feedUrl": dbItems.feedUrl });
                                        if (!guildsCheck)
                                            return;
                                        guildsCheck.forEach(function (guildItems) {
                                            guildItems.rssfeeds.forEach(function (rssItems) {
                                                if (rssItems.feedUrl === dbItems.feedUrl && new Date(rssItems.dateAdded) <= entryDate) {
                                                    let channelid = client.channels.cache.get(rssItems.channelid);
                                                    let guildID = client.guilds.cache.get(guildsCheck.id);
                                                    channelid.send(entry.link);
                                                }
                                            });
                                        });
                                    }
                                }
                            });
                        });
                    });
                });
            });
        });
    });
}
function checkTwitchStreams() {
    return __awaiter(this, void 0, void 0, function* () {
        var query = {
            $or: [
                { startedAt: { $lte: new Date(Date.now() - (60 * 60000)) } },
                { startedAt: null }
            ]
        };
        let allTwitchStreamers = yield TwitchModel.find(query);
        let i = 0;
        let x = 0;
        let streamerCount = 0;
        let userIDSArray = new Array();
        userIDSArray[i] = new Array();
        let profileImageUrl = "";
        let gamename = "";
        if (allTwitchStreamers.length > 0) {
            allTwitchStreamers.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                streamerCount++;
                if (streamerCount == 100) {
                    i++;
                    streamerCount = 0;
                    userIDSArray[i] = new Array();
                }
                userIDSArray[i].push(element.userID);
            }));
            let arrayID = 0;
            userIDSArray.forEach((element) => {
                var config = {
                    method: 'get',
                    url: 'https://api.twitch.tv/helix/streams',
                    params: { user_id: userIDSArray[arrayID] },
                    headers: {
                        'Client-ID': KeyFile.key.twitchClientID,
                        'Authorization': 'Bearer ' + KeyFile.key.twitchAccessToken
                    }
                };
                arrayID++;
                axios(config)
                    .then(function (response) {
                    response.data.data.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                        const oldStream = yield TwitchModel.findOne({ userID: element.user_id });
                        if (oldStream.startedAt >= new Date(element.started_at))
                            return;
                        yield TwitchModel.findOneAndUpdate({ userID: element.user_id }, { $set: { userName: element.user_name, gameID: element.game_id, streamID: element.id, title: element.title, startedAt: element.started_at, thumbnailURL: element.thumbnail_url } }, { new: true });
                        let guildsCheck = yield GuildModel.find({ "twitchstreams.userID": element.user_id });
                        if (!guildsCheck)
                            return;
                        var configGames = {
                            method: 'get',
                            url: `https://api.twitch.tv/helix/games?id=${element.game_id}`,
                            headers: {
                                'Client-ID': KeyFile.key.twitchClientID,
                                'Authorization': 'Bearer ' + KeyFile.key.twitchAccessToken
                            }
                        };
                        const gamesResponse = yield axios(configGames);
                        let gamename = gamesResponse.data.data[0].name;
                        var configUsers = {
                            method: 'get',
                            url: `https://api.twitch.tv/helix/users?id=${element.user_id}`,
                            headers: {
                                'Client-ID': KeyFile.key.twitchClientID,
                                'Authorization': 'Bearer ' + KeyFile.key.twitchAccessToken
                            }
                        };
                        axios(configUsers)
                            .then(function (userResponse) {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield TwitchModel.findOneAndUpdate({ userID: element.user_id }, { $set: { profile_image_url: userResponse.data.data[0].profile_image_url } }, { new: true });
                                profileImageUrl = userResponse.data.data[0].profile_image_url;
                                let thumbnail = element.thumbnail_url;
                                thumbnail = thumbnail.replace("{width}", "1920");
                                thumbnail = thumbnail.replace("{height}", "1080");
                                thumbnail = thumbnail + '?d=' + Math.floor(Date.now() / 1000);
                                guildsCheck.forEach(function (guildItems) {
                                    guildItems.twitchstreams.forEach(function (items) {
                                        if (items.userID === element.user_id) {
                                            let channelid = client.channels.cache.get(items.channelid);
                                            let guildID = client.guilds.cache.get(guildsCheck.id);
                                            const twitchEmbed = new Discord.MessageEmbed()
                                                .setColor('#0099ff')
                                                .setTitle(`${element.user_name} is live on twitch!`)
                                                .setURL(`https://www.twitch.tv/${element.user_name}`)
                                                .setAuthor(element.user_name, profileImageUrl)
                                                .setDescription(element.title)
                                                .setThumbnail(profileImageUrl)
                                                .addField('Streaming', gamename, true)
                                                .setImage(thumbnail);
                                            let message = `\`${element.user_name}\` is live on twitch! <https://www.twitch.tv/${element.user_name}> `;
                                            channelid.send(message, twitchEmbed);
                                        }
                                    });
                                });
                            });
                        })
                            .catch(function (error) {
                            console.log(error);
                        });
                    }));
                })
                    .catch(function (error) {
                    console.log(error);
                });
            });
        }
        else {
            return;
        }
    });
}
function handleCommand(msg, prefix2) {
    return __awaiter(this, void 0, void 0, function* () {
        let command = "";
        let args = [];
        if (prefix2 == "") {
            command = msg.content.split(" ")[1];
            args = msg.content.split(" ").slice(2);
        }
        else {
            command = msg.content.replace(prefix2, "").split(" ")[0];
            args = msg.content.split(" ").slice(1);
        }
        for (const commandClass of commands) {
            try {
                if (!commandClass.isThisCommand(command)) {
                    continue;
                }
                yield commandClass.runCommand(args, msg, client, commands);
            }
            catch (exception) {
                console.log(exception);
            }
        }
    });
}
function loadCommands(commandsPath) {
    if (!ConfigFile.config || ConfigFile.config.commands.length === 0) {
        return;
    }
    for (const commandName of ConfigFile.config.commands) {
        const commandsClass = require(`${commandsPath}/${commandName}`).default;
        const command = new commandsClass();
        commands.push(command);
    }
}
loadCommands(`${__dirname}/commands`);
if (devmode == 0) {
    setInterval(parseRSSFeeds, rssCheckTime);
    setInterval(checkTwitchStreams, twitchCheckTime);
}
client.on("ready", () => {
    console.log("Discord Logged On");
    parseRSSFeeds();
    checkTwitchStreams();
});
client.on("error", console.error);
client.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.author.bot) {
        return;
    }
    if (!msg.guild) {
        return;
    }
    let clientid = client.user.id;
    let guildBotObj = msg.guild.member(clientid);
    let nickname = msg.guild.member(clientid).nickname;
    let prefix = "";
    let guildDB = yield GuildModel.findOne({ id: msg.guild.id });
    if (guildDB) {
        prefix = guildDB.prefix;
    }
    else {
        const createGuild = new GuildModel({ id: msg.guild.id });
        yield createGuild.save();
        prefix = ConfigFile.config.prefix;
    }
    if (msg.mentions.has(guildBotObj)) {
        prefix = "";
    }
    if (!msg.content.startsWith(prefix)) {
        return;
    }
    handleCommand(msg, prefix);
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBc0M7QUFDdEMsdUNBQXVDO0FBQ3ZDLGtDQUFrQztBQUVsQyxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDeEMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzdDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ2pELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3JELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNyQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbkMsSUFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUUxQixNQUFNLFlBQVksR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNuQyxNQUFNLGVBQWUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFBO0FBR2pDLE1BQU0sTUFBTSxHQUFtQixJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNwRCxJQUFJLFFBQVEsR0FBa0IsRUFBRSxDQUFDO0FBR2pDLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztBQUloQixDQUFDLEdBQVMsRUFBRTtJQUNWLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUNwQixJQUFJLE9BQU8sSUFBSSxDQUFDLEVBQUU7UUFDaEIsVUFBVSxHQUFHLGFBQWEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLGNBQWMsT0FBTyxDQUFDLEdB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