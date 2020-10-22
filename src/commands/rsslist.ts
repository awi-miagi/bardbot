import * as Discord from "discord.js";
import { IBotCommand, IBotCommandHelp } from "../api";
import * as ConfigFile from "../config";
import fs = require('fs');
const GuildModel = require('../models/Guild');
const RSSFeedModel = require('../models/RSSFeed');
const { connect } = require('mongoose');
let Parser = require('rss-parser');
let parser = new Parser();


export default class rss implements IBotCommand {

    private readonly _command = "rsslist"

    help(): IBotCommandHelp {
        return { caption: this._command, description: 'rsslist - Lists RSS Feeds this guild is subscribed to. '};
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    }

    async runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client, commands: IBotCommand[]) {

        if (!msgObject.guild) {
            return;
        }


        //get guild info
    let guildInfo = await GuildModel.findOne({ id: msgObject.guild.id });
    if(!guildInfo) return;
    let guildRSS = guildInfo.rssfeeds;
    let rssArray = new Array();
    let x = 0;


    if (guildRSS.length > 0) {
        guildRSS.forEach(async (element: any) => {
        let channelName = msgObject.guild.channels.cache.get(element.channelid).name;
        let feedTitle = element.feedTitle;
        let feedUrl = element.feedUrl;
       
        msgObject.channel.send(`${feedTitle} - <${feedUrl}> - #${channelName}`);
  
      });
    }

    }
}