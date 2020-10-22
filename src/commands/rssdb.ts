import * as Discord from "discord.js";
import { IBotCommand, IBotCommandHelp } from "../api";
import * as ConfigFile from "../config";
import fs = require('fs');
const GuildModel = require('../models/Guild');
const RSSFeedModel = require('../models/RSSFeed');
const { connect } = require('mongoose');
let Parser = require('rss-parser');
let parser = new Parser();


export default class rssdb implements IBotCommand {

    private readonly _command = "rssdb"

    help(): IBotCommandHelp {
        return { caption: this._command, description: 'rssdb - Lists currently available RSS Feeds in the database.' };
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    }

    async runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client, commands: IBotCommand[]) {

        if (!msgObject.guild) {
            return;
        }

        const req = await RSSFeedModel.find();
        if (!req) return;

        msgObject.channel.send("Available RSS Feeds:")
        req.forEach((entry: any) => {
            msgObject.channel.send(`${entry.feedTitle} - ${entry.feedUrl}`);
        });

    }
}