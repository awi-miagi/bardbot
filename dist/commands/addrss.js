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
            let permissionGuild = yield GuildModel.findOne({ id: msgObject.guild.id, "commandpermissions.command": this._command });
            let permissions = yield permissionGuild.commandpermissions;
            var hasPermission = "FALSE";
            hasPermission = permissions.map((item) => {
                if (item.command == this._command && msgObject.member.roles.cache.has(item.role))
                    return 'TRUE';
            }).filter(function (item) { return item; })[0];
            if (!msgObject.member.hasPermission("ADMINISTRATOR") && !hasPermission) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkcnNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2FkZHJzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2xELE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ25DLElBQUksTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7QUFHMUIsTUFBcUIsTUFBTTtJQUEzQjtRQUVxQixhQUFRLEdBQUcsUUFBUSxDQUFBO0lBNEV4QyxDQUFDO0lBMUVHLElBQUk7UUFDQSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLHVFQUF1RSxFQUFFLENBQUM7SUFDNUgsQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUFlO1FBQ3pCLE9BQU8sT0FBTyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDckMsQ0FBQztJQUVLLFVBQVUsQ0FBQyxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFFLFFBQXVCOztZQUV4RyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRTtnQkFDbEIsT0FBTzthQUNWO1lBRUQsSUFBSSxlQUFlLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLDRCQUE0QixFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ3hILElBQUksV0FBVyxHQUFHLE1BQU0sZUFBZSxDQUFDLGtCQUFrQixDQUFDO1lBQzNELElBQUksYUFBYSxHQUFHLE9B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