import * as Discord from "discord.js";
import * as ConfigFile from "./config";
import * as KeyFile from "./keys";
import { IBotCommand } from "./api";
var bodyParser = require('body-parser');
var axios = require('axios');
const GuildModel = require('./models/Guild');
const RSSFeedModel = require('./models/RSSFeed');
const TwitchModel = require('./models/TwitchStream');
const mongoose = require('mongoose');
let Parser = require('rss-parser');
let parser = new Parser();

const rssCheckTime = 5 * 60 * 1000; //1000ms = 1 second
const twitchCheckTime = 60 * 1000


const client: Discord.Client = new Discord.Client();
let commands: IBotCommand[] = [];


let devmode = 0; //changes db and parse checks



(async () => {
  let connString = "";
  if (devmode == 0) {
    connString = `mongodb://${KeyFile.key.dbusername}:${KeyFile.key.dbpassword}@localhost/${KeyFile.key.db}?authSource=${KeyFile.key.dbauthsource}`;
  }
  else {
    connString = `mongodb://${KeyFile.key.dbusername}:${KeyFile.key.dbpassword}@${KeyFile.key.dbaddress}/${KeyFile.key.db}?authSource=${KeyFile.key.dbauthsource}`;
  }

  await mongoose.connect(connString, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  return client.login(KeyFile.key.bottoken)
    .catch(console.error);
})()



async function parseRSSFeeds() {

  //get all feeds and loop
  let allFeeds = await RSSFeedModel.find({});
  let newItems: { itemTitle: any; itemLink: any; itemDate: any; }[] = [];
  allFeeds.forEach(async function (dbItems: any) {
    //console.log(dbItems.feedUrl);
    //set latestDate to compate
    var dbDate = new Date(dbItems.latestDate);
    let oldFeedItems = dbItems.feedItems;
    //console.log(oldFeedItems);
    //get RSS feed for each Feed
    parser.parseURL(dbItems.feedUrl, async function (err: any, feed: any) {
      if (err) console.log(err);
      feed.items.forEach(async function (entry: any) {
        if (entry.link) {
          var entryDate = new Date(entry.isoDate);
          //see if article dates are after the latestDate
          if (entryDate >= dbDate) {
            //See if article url is already in the DB
            let dupCheck = await RSSFeedModel.findOne({ "feedUrl": dbItems.feedUrl, "feedItems.itemLink": entry.link })
            //if so, stop
            if (dupCheck) return;
            oldFeedItems.push({ "itemTitle": entry.title, "itemLink": entry.link, "itemDate": entry.isoDate });
            let currDate = new Date();
            await RSSFeedModel.findOneAndUpdate({ "feedUrl": dbItems.feedUrl }, { $set: { "feedItems": oldFeedItems, "latestDate": currDate } }, { new: true });
            let guildsCheck = await GuildModel.find({ "rssfeeds.feedUrl": dbItems.feedUrl })
            if (!guildsCheck) return;
            guildsCheck.forEach(function (guildItems: any) {
              guildItems.rssfeeds.forEach(function (rssItems: any) {
                if (rssItems.feedUrl === dbItems.feedUrl && new Date(rssItems.dateAdded) <= entryDate) {
                  let channelid = client.channels.cache.get(rssItems.channelid) as Discord.TextChannel;
                  let guildID = client.guilds.cache.get(guildsCheck.id);
                  channelid.send(entry.link);
                }
              });
            });
          }
        }
      })
    });
  });
}

async function checkTwitchStreams() {
  var query = {
                $or:[
                    {startedAt: { $lte: new Date(Date.now() - (60 * 60000))}},
                    {startedAt: null}
                ]
              };
  let allTwitchStreamers = await TwitchModel.find(query); //find twitch streams that are less than or equal to current time - 1 hour
  let i = 0;
  let x = 0;
  let streamerCount = 0;
  let userIDSArray = new Array();
  userIDSArray[i] = new Array();
  let profileImageUrl = "";
  let gamename = "";


  if (allTwitchStreamers.length > 0) {
    allTwitchStreamers.forEach(async (element: any) => {
      streamerCount++;

      //group into groups of 100 since twitch limits up to 100 ids
      if (streamerCount == 100) {
        i++;
        streamerCount = 0;
        userIDSArray[i] = new Array();
      }
      userIDSArray[i].push(element.userID);

    });

    //start at 0 and then loop through all the ids
    let arrayID = 0;
    userIDSArray.forEach((element: any) => {

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
        .then(function (response: any) {
          response.data.data.forEach(async (element: any) => {

            const oldStream = await TwitchModel.findOne({ userID: element.user_id });
            if (oldStream.startedAt >= new Date(element.started_at)) return;
            await TwitchModel.findOneAndUpdate({ userID: element.user_id }, { $set: { userName: element.user_name, gameID: element.game_id, streamID: element.id, title: element.title, startedAt: element.started_at, thumbnailURL: element.thumbnail_url } }, { new: true });
            let guildsCheck = await GuildModel.find({ "twitchstreams.userID": element.user_id })
            if (!guildsCheck) return;

            var configGames = {
              method: 'get',
              url: `https://api.twitch.tv/helix/games?id=${element.game_id}`,
              headers: {
                'Client-ID': KeyFile.key.twitchClientID,
                'Authorization': 'Bearer ' + KeyFile.key.twitchAccessToken
              }
            };

            const gamesResponse = await axios(configGames);
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
              .then(async function (userResponse: { data: any }) {
                await TwitchModel.findOneAndUpdate({ userID: element.user_id }, { $set: { profile_image_url: userResponse.data.data[0].profile_image_url } }, { new: true });
                profileImageUrl = userResponse.data.data[0].profile_image_url;
                let thumbnail = element.thumbnail_url;
                thumbnail = thumbnail.replace("{width}", "1920");
                thumbnail = thumbnail.replace("{height}", "1080");
                thumbnail = thumbnail + '?d=' + Math.floor(Date.now() / 1000);


                guildsCheck.forEach(function (guildItems: any) {
                  guildItems.twitchstreams.forEach(function (items: any) {
                    if (items.userID === element.user_id) {
                      let channelid = client.channels.cache.get(items.channelid) as Discord.TextChannel;
                      let guildID = client.guilds.cache.get(guildsCheck.id);


                      const twitchEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`${element.user_name} is live on twitch!`)
                        .setURL(`https://www.twitch.tv/${element.user_name}`)
                        .setAuthor(element.user_name, profileImageUrl)
                        .setDescription(element.title)
                        .setThumbnail(profileImageUrl)
                        .addField('Streaming', gamename, true)
                        .setImage(thumbnail)
                      let message = `\`${element.user_name}\` is live on twitch! <https://www.twitch.tv/${element.user_name}> `;
                      channelid.send(message, twitchEmbed);
                    }
                  });
                });

              })
              .catch(function (error: any) {
                console.log(error);
              });
          });

        })
        .catch(function (error: any) {
          console.log(error);
        });
    });
  }
  else {
    return;
  }
}



async function handleCommand(msg: Discord.Message, prefix2: string) {
  //split the string into the command and all of the args
  //let command = msg.content.split(" ")[0].replace(prefix2, "");
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
    //attempt to execute code
    try {
      //check our commands class is the correct one
      if (!commandClass.isThisCommand(command)) {
        continue;
      }
      //pause execution while we run the command's code
      await commandClass.runCommand(args, msg, client, commands);
    }
    catch (exception) {
      console.log(exception);
    }
  }
}




function loadCommands(commandsPath: string) {
  //exit if there are no commands
  if (!ConfigFile.config || (ConfigFile.config.commands as string[]).length === 0) { return; }

  //Loop through all of the commands
  for (const commandName of ConfigFile.config.commands as string[]) {
    const commandsClass = require(`${commandsPath}/${commandName}`).default;
    const command = new commandsClass() as IBotCommand;

    commands.push(command);

  }
}

loadCommands(`${__dirname}/commands`);

//initial parse
if (devmode == 0) {
  setInterval(parseRSSFeeds, rssCheckTime)
  setInterval(checkTwitchStreams, twitchCheckTime)
}

//discord logged in  
client.on("ready", () => {
  console.log("Discord Logged On");
  parseRSSFeeds();
  checkTwitchStreams();
})

//log any errors
client.on("error", console.error);


//guild messages
client.on("message", async (msg) => {
  //ignore the message if it was sent by the bot
  if (msg.author.bot) { return; }

  if (!msg.guild) {
    return;
  }

  let clientid = client.user.id;
  let guildBotObj = msg.guild.member(clientid);
  let nickname = msg.guild.member(clientid).nickname;

  //ignore messages that don't start with prefix
  let prefix = "";
  let guildDB = await GuildModel.findOne({ id: msg.guild.id })

  //see if there is a prefix set in DB and set it
  if (guildDB) {
    prefix = guildDB.prefix;
  }
  else {
    const createGuild = new GuildModel({ id: msg.guild.id });
    await createGuild.save();
    prefix = ConfigFile.config.prefix;
  }

  //if bot is mentioned, consider that the prefix
  if (msg.mentions.has(guildBotObj)) {
    prefix = "";
  }

  if (!msg.content.startsWith(prefix)) { return; }
  //handle the command
  handleCommand(msg, prefix);
})
