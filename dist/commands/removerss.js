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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3ZlcnNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3JlbW92ZXJzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2xELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBRzlDLE1BQXFCLFNBQVM7SUFBOUI7UUFFcUIsYUFBUSxHQUFHLFdBQVcsQ0FBQTtJQXNEM0MsQ0FBQztJQXBERyxJQUFJO1FBQ0EsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSwyREFBMkQsRUFBRSxDQUFDO0lBQ2hILENBQUM7SUFFRCxhQUFhLENBQUMsT0FBZTtRQUN6QixPQUFPLE9BQU8sS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3JDLENBQUM7SUFFSyxVQUFVLENBQUMsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBRSxRQUF1Qjs7WUFFeEcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2xCLE9BQU87YUFDVjtZQUVELElBQUksZUFBZSxHQUFHLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSw0QkFBNEIsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN4SCxJQUFJLFdBQVcsR0FBRyxNQUFNLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQztZQUMzRCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUM7WUFFNUIsYUFBYSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFxQyxFQUFFLEVBQUU7Z0JBQ3RFLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDNUUsT0FBTyxNQUFNLENBQUM7WUFDdEIsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBUyxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFHcEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUNwRSxPQUFPO2FBQ1Y7WUFFRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUd2QyxNQUFNLFlBQVksR0FBRyxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxZQUFZO2dCQUFFLE9BQU87WUFFMUIsTUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztZQUV6QyxJQUFJLFdBQVcsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBdUI7Z0JBQ2pFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUM7WUFDaEMsQ0FBQyxDQUFDLENBQUM7WUFJSCxNQUFNLEdBQUcsR0FBRyxNQUFNLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7aUJBQ3hILElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLGFBQWEsT0FBTyw4QkFBOEIsQ0FBQyxDQUFDLENBQUM7WUFHL0UsTUFBTSxTQUFTLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsa0JBQWtCLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUM1RSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNaLE1BQU0sVUFBVSxHQUFHLE1BQU0sWUFBWSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7YUFDaEY7UUFFTCxDQUFDO0tBQUE7Q0FDSjtBQXhERCw0QkF3REMifQ==