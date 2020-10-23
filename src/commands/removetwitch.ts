import * as Discord from "discord.js";
import { IBotCommand, IBotCommandHelp } from "../api";
const TwitchModel = require('../models/TwitchStream');
const GuildModel = require('../models/Guild');



export default class removetwitch implements IBotCommand {

  private readonly _command = "removetwitch"

  help(): IBotCommandHelp {
    return { caption: this._command, description: 'removetwitch <twitch username> - Removes specified twitch user stream alerts from the guild.' };
  }

  isThisCommand(command: string): boolean {
    return command === this._command;
  }

  async runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client, commands: IBotCommand[]) {

    if (!msgObject.guild) {
      return;
    }

    let hasPermission = "FALSE";

    let permissionGuild = await GuildModel.findOne({ id: msgObject.guild.id, "commandpermissions.command": this._command });
    if (permissionGuild) {
        hasPermission = await permissionGuild.commandpermissions.map((item: { command: any; role: string; }) => {
          if (item.command == this._command && msgObject.member.roles.cache.has(item.role))
            return 'TRUE';
        }).filter(function (item: any) { return item; })[0];
    }

    if (msgObject.member.hasPermission("ADMINISTRATOR")) {
      hasPermission = "TRUE";
    }

    if (hasPermission != "TRUE") {
      return;
    }


    let arg = args.slice(0).join(" ").trim();
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

    //find if twitch stream exists in streamers
    const streamers = await TwitchModel.findOne({ userName: { $regex: new RegExp(twitchName, "i") } });
    const streamerID = await streamers.userID;

    //get guilds streamers
    const guildRecords = await GuildModel.findOne({ id: msgObject.guild.id });
    if (!guildRecords) return;

    const guildStreamers = guildRecords.twitchstreams;

    let newStreamData = guildStreamers.filter(function (e: { userID: string; }) {
      return e.userID != streamerID;
    });


    //update guilds streamers
    const doc = await GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { twitchstreams: newStreamData } }, { new: true })
      .then(msgObject.reply(`Removed \`${streamers.userName}\` twitch stream from this guild.`));

    //Check if any guild is using this streamer, otherwise delete them from the streamers table.
    const streamerCheck = await GuildModel.findOne({ "twitchstreams.userID": streamerID });
    if (!streamerCheck) {
      const streamerDelete = await TwitchModel.findOneAndDelete({ userID: streamerID });
    }

  }
}