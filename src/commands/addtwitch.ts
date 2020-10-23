import * as Discord from "discord.js";
import { IBotCommand, IBotCommandHelp } from "../api";
import * as KeyFile from "../keys";
const TwitchModel = require('../models/TwitchStream');
const GuildModel = require('../models/Guild');
var axios = require('axios');



export default class addtwitch implements IBotCommand {

  private readonly _command = "addtwitch"

  help(): IBotCommandHelp {
    return { caption: this._command, description: 'addtwitch <channel> <twitch username> - Adds a twitch stream to specified channel' };
  }

  isThisCommand(command: string): boolean {
    return command === this._command;
  }

  async runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client, commands: IBotCommand[]) {

    if (!msgObject.guild) {
      return;
    }

    let permissionGuild = await GuildModel.findOne({ id: msgObject.guild.id, "commandpermissions.command": this._command });
    let permissions = await permissionGuild.commandpermissions;
    var hasPermission = "FALSE";

    hasPermission = permissions.map((item: { command: any; role: string; }) => {
      if (item.command == this._command && msgObject.member.roles.cache.has(item.role))
        return 'TRUE';
    }).filter(function (item: any) { return item; })[0];


    if (!msgObject.member.hasPermission("ADMINISTRATOR") && !hasPermission) {
      return;
    }
    let channel = msgObject.mentions.channels.first();
    if (!channel) return msgObject.reply('You did not specify a channel.');
    let arg = args.slice(1).join(" ").trim();
    let twitchName = "";

    if (arg.search("/") >= 0) {
      if (arg.search("twitch") === -1) {
        return msgObject.reply(`\`${arg}\` is not a valid Twitch channel.`);
      }
      var twitchName2 = arg.split("/");
      if (twitchName2[twitchName2.length - 1] == '') {
        twitchName = twitchName2[twitchName2.length - 2];
      }
      else {
        twitchName = twitchName2[twitchName2.length - 1];
      }
    }
    else {
      twitchName = arg;
    }

    let feeddata = [];
    let response = null;

    //find if twitch stream already exists in streamers
    const streamers = await TwitchModel.findOne({ userName: { $regex: new RegExp(twitchName, "i") } });

    //check if streamer is already set in the guild and stop if so

    if (streamers) {
      let checkGuildDup = await GuildModel.findOne({ id: msgObject.guild.id, "twitchstreams.userID": streamers.userID });
      if (checkGuildDup) return msgObject.reply(`\`${twitchName}\` is already set for a channel.`) //streamer already exists and already in guild
    }
    var config = {
      method: 'get',
      url: `https://api.twitch.tv/helix/users?login=${twitchName}`,
      headers: {
        'Client-ID': KeyFile.key.twitchClientID,
        'Authorization': 'Bearer ' + KeyFile.key.twitchAccessToken
      }
    };

    //see if guild exists in db and grab streams if it exists, otherwise create the guild
    const guildCheck = await GuildModel.findOne({ id: msgObject.guild.id });
    if (!guildCheck) {
      const createGuild = new GuildModel({ id: msgObject.guild.id });
      await createGuild.save();
    }
    else {
      feeddata = guildCheck.twitchstreams;
    }

    if (!streamers) {
      response = await axios(config)
        .catch(function (error: any) {
          console.log(error);
          return error;
        });

      if (response == "Error: Request failed with status code 400")
        return msgObject.reply(`\`${twitchName}\` is not a valid twitch username or there was a problem with the Twitch API.`);
      if (!response.data.data[0]) {
        return msgObject.reply(`\`${twitchName}\` is not a valid twitch username.`);
      }
      let checkGuildDup = await GuildModel.findOne({ id: msgObject.guild.id, "twitchstreams.userID": response.data.data[0].id });

      if (response.data) {
        let twitchCheck = await TwitchModel.findOne({ userID: response.data.data[0].id })
        if (!twitchCheck) {
          const doc = new TwitchModel({ userID: response.data.data[0].id, userName: response.data.data[0].login, displayName: response.data.data[0].display_name });
          await doc.save();
        }
        if (!checkGuildDup) {
          feeddata.push({ userID: response.data.data[0].id, userName: response.data.data[0].login, channelid: channel.id });
          const doc = await GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { twitchstreams: feeddata } }, { new: true });
        }
        return msgObject.reply(`Added \`${response.data.data[0].display_name}\` twitch stream alerts to \`#${channel.name}\`.`);
      }
    }
    else {
      let checkGuildDup = await GuildModel.findOne({ id: msgObject.guild.id, "twitchstreams.userID": streamers.userID });
      if (!checkGuildDup) {
        feeddata.push({ userID: streamers.userID, userName: streamers.userName, channelid: channel.id });
        const doc = await GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { twitchstreams: feeddata } }, { new: true });
      }
      return msgObject.reply(`Added \`${streamers.userName}\` twitch stream alerts to \`#${channel.name}\`.`);
    }
  }
}