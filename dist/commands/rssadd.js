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
const RSSFeedModel = require('../models/RSSFeed');
const { connect } = require('mongoose');
let Parser = require('rss-parser');
let parser = new Parser();
class rssadd {
    constructor() {
        this._command = "rssadd";
    }
    help() {
        return { caption: this._command, description: 'Adds an RSS Feed to the bot\'s database' };
    }
    isThisCommand(command) {
        return command === this._command;
    }
    runCommand(args, msgObject, client, commands) {
        return __awaiter(this, void 0, void 0, function* () {
            if (msgObject.author.id != "265665473469874176") {
                return;
            }
            let url = args.splice(0).join(" ").trim();
            const req = yield RSSFeedModel.findOne({ feedUrl: url });
            if (req)
                return msgObject.reply(`Feed already exists in database.`);
            parser.parseURL(url, function (err, feed) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        return msgObject.reply('there was a problem adding that site. Is this a valid RSS Feed?');
                    let feedTitle = yield feed.title.trim();
                    if (!feedTitle)
                        return msgObject.reply('RSS Feed is missing the Site Title. Is this a valid RSS Feed?');
                    let feedItems = [];
                    const req2 = yield RSSFeedModel.findOne({ feedTitle: feedTitle });
                    if (req2)
                        return msgObject.reply(`Feed already exists in database.`);
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
                    msgObject.reply(`Added new RSS feed: \`${doc.feedTitle}\``);
                });
            });
        });
    }
}
exports.default = rssadd;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnNzYWRkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3Jzc2FkZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUlBLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2xELE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ25DLElBQUksTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7QUFHMUIsTUFBcUIsTUFBTTtJQUEzQjtRQUVxQixhQUFRLEdBQUcsUUFBUSxDQUFBO0lBOEN4QyxDQUFDO0lBNUNHLElBQUk7UUFDQSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLHlDQUF5QyxFQUFFLENBQUM7SUFDOUYsQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUFlO1FBQ3pCLE9BQU8sT0FBTyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDckMsQ0FBQztJQUVLLFVBQVUsQ0FBQyxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFFLFFBQXVCOztZQUd4RyxJQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLG9CQUFvQixFQUFDO2dCQUMzQyxPQUFPO2FBQ1Y7WUFFRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUUxQyxNQUFNLEdBQUcsR0FBRyxNQUFNLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN6RCxJQUFJLEdBQUc7Z0JBQUUsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7WUFFcEUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsVUFBZ0IsR0FBUSxFQUFFLElBQVM7O29CQUNwRCxJQUFJLEdBQUc7d0JBQUUsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLGlFQUFpRSxDQUFDLENBQUM7b0JBQ25HLElBQUksU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDeEMsSUFBRyxDQUFDLFNBQVM7d0JBQUUsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLCtEQUErRCxDQUFDLENBQUM7b0JBQ3ZHLElBQUksU0FBUyxHQUF3RCxFQUFFLENBQUM7b0JBQ3hFLE1BQU0sSUFBSSxHQUFHLE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO29CQUNsRSxJQUFJLElBQUk7d0JBQUUsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7b0JBQ3JFLElBQUksUUFBUSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7b0JBQzFCLE1BQU0sR0FBRyxHQUFHLElBQUksWUFBWSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUMzRixNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFFakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFVO3dCQUNuQyxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTs0QkFDM0IsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQzt5QkFDN0Y7NkJBRUQ7NEJBQ0ksT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7eUJBQzNFO29CQUNMLENBQUMsQ0FBQyxDQUFBO29CQUNGLE1BQU0sWUFBWSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDekcsU0FBUyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsR0FBRyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hFLENBQUM7YUFBQSxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQUE7Q0FDSjtBQWhERCx5QkFnREMifQ==