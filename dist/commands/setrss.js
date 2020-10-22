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
class setrss {
    constructor() {
        this._command = "setrss";
    }
    help() {
        return { caption: this._command, description: 'Adds the RSS Feed to the channel the command is issued in.' };
    }
    isThisCommand(command) {
        return command === this._command;
    }
    runCommand(args, msgObject, client, commands) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!msgObject.guild) {
                return;
            }
            if (!msgObject.member.hasPermission("ADMINISTRATOR")) {
                return;
            }
            let feedTitle = args.splice(0).join(" ");
            let feeddata = [];
            const req = yield RSSFeedModel.findOne({ feedTitle: feedTitle });
            if (!req)
                return msgObject.reply(`Feed does not exist in database.`);
            const checkDup = yield GuildModel.findOne({ id: msgObject.guild.id, "rssfeeds.feedTitle": feedTitle });
            if (checkDup)
                return msgObject.reply(`\`${feedTitle}\` is already set for a channel.`);
            let feedUrl = yield req.feedUrl;
            const req2 = yield GuildModel.findOne({ id: msgObject.guild.id });
            if (!req2) {
                const createGuild = new GuildModel({ id: msgObject.guild.id });
                yield createGuild.save();
            }
            else {
                feeddata = req2.rssfeeds;
            }
            let currDate = new Date();
            feeddata.push({ feedTitle: feedTitle, feedUrl: feedUrl, channelid: msgObject.channel.id, dateAdded: currDate });
            const doc = yield GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { rssfeeds: feeddata } }, { new: true });
            return msgObject.reply(`Set \`${feedTitle}\` Feed to display in this channel.`);
        });
    }
}
exports.default = setrss;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0cnNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3NldHJzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUlBLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2xELE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ25DLElBQUksTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7QUFHMUIsTUFBcUIsTUFBTTtJQUEzQjtRQUVxQixhQUFRLEdBQUcsUUFBUSxDQUFBO0lBNkN4QyxDQUFDO0lBM0NHLElBQUk7UUFDQSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLDREQUE0RCxFQUFFLENBQUM7SUFDakgsQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUFlO1FBQ3pCLE9BQU8sT0FBTyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDckMsQ0FBQztJQUVLLFVBQVUsQ0FBQyxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFFLFFBQXVCOztZQUV4RyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRTtnQkFDbEIsT0FBTzthQUNWO1lBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxFQUNwRDtnQkFDSSxPQUFPO2FBQ1Y7WUFFRCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QyxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFFbEIsTUFBTSxHQUFHLEdBQUcsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDakUsSUFBSSxDQUFDLEdBQUc7Z0JBQUUsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7WUFFckUsTUFBTSxRQUFRLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLG9CQUFvQixFQUFHLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDeEcsSUFBRyxRQUFRO2dCQUFFLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLFNBQVMsa0NBQWtDLENBQUMsQ0FBQTtZQUNyRixJQUFJLE9BQU8sR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFDaEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNsRSxJQUFHLENBQUMsSUFBSSxFQUNSO2dCQUNJLE1BQU0sV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQztnQkFDOUQsTUFBTSxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDNUI7aUJBRUQ7Z0JBQ0ksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDNUI7WUFDRCxJQUFJLFFBQVEsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQzFCLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO1lBQy9HLE1BQU0sR0FBRyxHQUFHLE1BQU0sVUFBVSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzNILE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLFNBQVMscUNBQXFDLENBQUMsQ0FBQztRQUNwRixDQUFDO0tBQUE7Q0FDSjtBQS9DRCx5QkErQ0MifQ==