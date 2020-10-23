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
const GuildModel = require('../models/Guild');
const RSSFeedModel = require('../models/RSSFeed');
const { connect } = require('mongoose');
let Parser = require('rss-parser');
let parser = new Parser();
class addrss {
    constructor() {
        this._command = "addrss";
    }
    help() {
        return { caption: this._command, description: 'addrss <channel> <RSS URL> - Adds an RSS Feed to a specified channel.' };
    }
    isThisCommand(command) {
        return command === this._command;
    }
    runCommand(args, msgObject, client, commands) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!msgObject.guild) {
                return;
            }
            let hasPermission = "FALSE";
            let permissionGuild = yield GuildModel.findOne({ id: msgObject.guild.id, "commandpermissions.command": this._command });
            if (permissionGuild) {
                hasPermission = yield permissionGuild.commandpermissions.map((item) => {
                    if (item.command == this._command && msgObject.member.roles.cache.has(item.role))
                        return 'TRUE';
                }).filter(function (item) { return item; })[0];
            }
            if (msgObject.member.hasPermission("ADMINISTRATOR")) {
                hasPermission = "TRUE";
            }
            if (hasPermission != "TRUE") {
                return;
            }
            let channel = msgObject.mentions.channels.first();
            if (!channel)
                return msgObject.reply('You did not specify a channel.');
            let url = args.splice(1).join(" ").trim();
            let feeddata = [];
            let feedTitle = "";
            const req = yield RSSFeedModel.findOne({ feedUrl: url });
            const checkDup = yield GuildModel.findOne({ id: msgObject.guild.id, "rssfeeds.feedUrl": url });
            if (checkDup)
                return msgObject.reply(`\`${req.feedTitle}\` is already set for a channel.`);
            if (!req) {
                parser.parseURL(url, function (err, feed) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (err)
                            return msgObject.reply('there was a problem adding that site. Is this a valid RSS Feed?');
                        feedTitle = yield feed.title.trim();
                        if (!feedTitle || feedTitle == "")
                            return msgObject.reply('RSS Feed is missing the Site Title. Is this a valid RSS Feed?');
                        let feedItems = [];
                        let currDate = new Date();
                        const doc = new RSSFeedModel({ feedUrl: url, feedTitle: feedTitle, latestDate: currDate });
                        yield doc.save();
                        feed.items.forEach(function (entry) {
                            if (entry.link && entry.title) {
                                feedItems.push({ itemTitle: entry.title, itemLink: entry.link, itemDate: entry.isoDate });
                            }
                            else {
                                return msgObject.reply('Unable to add feed. Is this a valid RSS Feed?');
                            }
                        });
                        yield RSSFeedModel.findOneAndUpdate({ feedUrl: url }, { $set: { feedItems: feedItems } }, { new: true });
                    });
                });
            }
            else {
                feedTitle = req.feedTitle;
            }
            const req2 = yield GuildModel.findOne({ id: msgObject.guild.id });
            if (!req2) {
                const createGuild = new GuildModel({ id: msgObject.guild.id });
                yield createGuild.save();
            }
            else {
                feeddata = req2.rssfeeds;
            }
            let currDate = new Date();
            feeddata.push({ feedTitle: feedTitle, feedUrl: url, channelid: channel.id, dateAdded: currDate });
            const doc = yield GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { rssfeeds: feeddata } }, { new: true });
            return msgObject.reply(`Set \`${feedTitle}\` Feed to display in \`#${channel.name}\`.`);
        });
    }
}
exports.default = addrss;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkcnNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2FkZHJzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2xELE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ25DLElBQUksTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7QUFHMUIsTUFBcUIsTUFBTTtJQUEzQjtRQUVxQixhQUFRLEdBQUcsUUFBUSxDQUFBO0lBaUZ4QyxDQUFDO0lBL0VHLElBQUk7UUFDQSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLHVFQUF1RSxFQUFFLENBQUM7SUFDNUgsQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUFlO1FBQ3pCLE9BQU8sT0FBTyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDckMsQ0FBQztJQUVLLFVBQVUsQ0FBQyxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFFLFFBQXVCOztZQUV4RyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRTtnQkFDbEIsT0FBTzthQUNWO1lBRUQsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDO1lBRTVCLElBQUksZUFBZSxHQUFHLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSw0QkFBNEIsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN4SCxJQUFJLGVBQWUsRUFBRTtnQkFDakIsYUFBYSxHQUFHLE1B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