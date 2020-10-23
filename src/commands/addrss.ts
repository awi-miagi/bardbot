import * as Discord from "discord.js";
import { IBotCommand, IBotCommandHelp } from "../api";
const GuildModel = require('../models/Guild');
const RSSFeedModel = require('../models/RSSFeed');
const { connect } = require('mongoose');
let Parser = require('rss-parser');
let parser = new Parser();


export default class addrss implements IBotCommand {

    private readonly _command = "addrss"

    help(): IBotCommandHelp {
        return { caption: this._command, description: 'addrss <channel> <RSS URL> - Adds an RSS Feed to a specified channel.' };
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

        let channel = msgObject.mentions.channels.first();
        if (!channel) return msgObject.reply('You did not specify a channel.');
        let url = args.splice(1).join(" ").trim();
        let feeddata = [];
        let feedTitle = "";

        const req = await RSSFeedModel.findOne({ feedUrl: url });

        const checkDup = await GuildModel.findOne({ id: msgObject.guild.id, "rssfeeds.feedUrl": url });
        if (checkDup) return msgObject.reply(`\`${req.feedTitle}\` is already set for a channel.`)

        if (!req) {
            parser.parseURL(url, async function (err: any, feed: any) {
                if (err) return msgObject.reply('there was a problem adding that site. Is this a valid RSS Feed?');
                feedTitle = await feed.title.trim();
                if (!feedTitle || feedTitle == "") return msgObject.reply('RSS Feed is missing the Site Title. Is this a valid RSS Feed?');
                let feedItems: { itemTitle: any; itemLink: any; itemDate: Date }[] = [];
                let currDate = new Date();
                const doc = new RSSFeedModel({ feedUrl: url, feedTitle: feedTitle, latestDate: currDate });
                await doc.save();
                feed.items.forEach(function (entry: any) {
                    if (entry.link && entry.title) {
                        feedItems.push({ itemTitle: entry.title, itemLink: entry.link, itemDate: entry.isoDate });
                    }
                    else {
                        return msgObject.reply('Unable to add feed. Is this a valid RSS Feed?');
                    }
                })
                await RSSFeedModel.findOneAndUpdate({ feedUrl: url }, { $set: { feedItems: feedItems } }, { new: true });
            });
        }
        else {
            feedTitle = req.feedTitle
        }
        const req2 = await GuildModel.findOne({ id: msgObject.guild.id });
        if (!req2) {
            const createGuild = new GuildModel({ id: msgObject.guild.id });
            await createGuild.save();
        }
        else {
            feeddata = req2.rssfeeds;
        }
        let currDate = new Date();
        feeddata.push({ feedTitle: feedTitle, feedUrl: url, channelid: channel.id, dateAdded: currDate });
        const doc = await GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { rssfeeds: feeddata } }, { new: true });
        return msgObject.reply(`Set \`${feedTitle}\` Feed to display in \`#${channel.name}\`.`);
    }
}