import * as Discord from "discord.js";
import { IBotCommand, IBotCommandHelp } from "../api";
import * as ConfigFile from "../config";
import * as KeyFile from "../keys";
import fs = require('fs');
const TwitchModel = require('../models/TwitchStream');
const GuildModel = require('../models/Guild');
var axios = require('axios');



export default class twitchlist implements IBotCommand {

  private readonly _command = "twitchlist"

  help(): IBotCommandHelp {
    return { caption: this._command, description: 'twitchlist - Lists twitch stream alerts this guild is subscribed to.' };
  }

  isThisCommand(command: string): boolean {
    return command === this._command;
  }

  async runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client, commands: IBotCommand[]) {


    //get guild info
    let guildInfo = await GuildModel.findOne({ id: msgObject.guild.id });
    if(!guildInfo) return;
    let guildStreamers = guildInfo.twitchstreams;
    let streamersArray = new Array();
    let x = 0;


    if (guildStreamers.length > 0) {
      guildStreamers.forEach(async (element: any) => {
        let channelName = msgObject.guild.channels.cache.get(element.channelid).name;
        let streamers = await TwitchModel.findOne({ "userID": element.userID });
        let streamersName = await streamers.userName
       
        msgObject.channel.send(`${streamersName} - #${channelName}`);
  
      });
    }

    // let msgEmbed = new Discord.MessageEmbed()
    //         .setTitle("Here is a list of our twitch stream notices")
    //         .setColor("#ff0000");

    // for(const streamer of guildStreamers)
    // {
    //   console.log(streamer.userID);
    //   const streamers = await TwitchModel.findOne({ userID: streamer.userID  });
    //   console.log(streamers);
    //   let channelName = msgObject.guild.channels.cache.get(streamer.channelid).name;
    //   //streamersArray.push({"userName":streamers.userName,"channelName":channelName});
    //     msgEmbed.addFields([{name: streamers.userName, inline: true}]);
    // }

    // msgObject.channel.send(msgEmbed);

  
}
}