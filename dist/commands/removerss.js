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
const GuildModel = require('../models/Guild');
class removerss {
    constructor() {
        this._command = "removerss";
    }
    help() {
        return { caption: this._command, description: 'removerss <RSS URL> - Removes an RSS Feed from the guild.' };
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
            let feedUrl = args.splice(0).join(" ");
            const guildRecords = yield GuildModel.findOne({ id: msgObject.guild.id });
            if (!guildRecords)
                return;
            const guildFeeds = guildRecords.rssfeeds;
            let newFeedData = guildFeeds.filter(function (e) {
                return e.feedUrl != feedUrl;
            });
            const doc = yield GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { rssfeeds: newFeedData } }, { new: true })
                .then(msgObject.reply(`Removed \`${feedUrl}\` RSS Feed from this guild.`));
            const feedCheck = yield GuildModel.findOne({ "rssfeeds.feedUrl": feedUrl });
            if (!feedCheck) {
                const feedDelete = yield RSSFeedModel.findOneAndDelete({ feedUrl: feedUrl });
            }
        });
    }
}
exports.default = removerss;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3ZlcnNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3JlbW92ZXJzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2xELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBRzlDLE1BQXFCLFNBQVM7SUFBOUI7UUFFcUIsYUFBUSxHQUFHLFdBQVcsQ0FBQTtJQTBEM0MsQ0FBQztJQXhERyxJQUFJO1FBQ0EsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSwyREFBMkQsRUFBRSxDQUFDO0lBQ2hILENBQUM7SUFFRCxhQUFhLENBQUMsT0FBZTtRQUN6QixPQUFPLE9BQU8sS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3JDLENBQUM7SUFFSyxVQUFVLENBQUMsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBRSxRQUF1Qjs7WUFFeEcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2xCLE9BQU87YUFDVjtZQUVELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQztZQUU1QixJQUFJLGVBQWUsR0FBRyxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDeEgsSUFBSSxlQUFlLEVBQUU7Z0JBQ2pCLGFBQWEsR0FBRyxNQUFNLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFxQyxFQUFFLEVBQUU7b0JBQ3JHLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzt3QkFDOUUsT0FBTyxNQUFNLENBQUM7Z0JBQ2xCLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQVMsSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3ZEO1lBRUQsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDbkQsYUFBYSxHQUFHLE1BQU0sQ0FBQzthQUN4QjtZQUVELElBQUksYUFBYSxJQUFJLE1BQU0sRUFBRTtnQkFDM0IsT0FBTzthQUNSO1lBRUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFHdkMsTUFBTSxZQUFZLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsWUFBWTtnQkFBRSxPQUFPO1lBRTFCLE1BQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7WUFFekMsSUFBSSxXQUFXLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQXVCO2dCQUNqRSxPQUFPLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDO1lBQ2hDLENBQUMsQ0FBQyxDQUFDO1lBSUgsTUFBTSxHQUFHLEdBQUcsTUFBTSxVQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDO2lCQUN4SCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxhQUFhLE9BQU8sOEJBQThCLENBQUMsQ0FBQyxDQUFDO1lBRy9FLE1BQU0sU0FBUyxHQUFHLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDNUUsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDWixNQUFNLFVBQVUsR0FBRyxNQUFNLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO2FBQ2hGO1FBRUwsQ0FBQztLQUFBO0NBQ0o7QUE1REQsNEJBNERDIn0=