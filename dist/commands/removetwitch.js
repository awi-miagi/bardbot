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
const TwitchModel = require('../models/TwitchStream');
const GuildModel = require('../models/Guild');
class removetwitch {
    constructor() {
        this._command = "removetwitch";
    }
    help() {
        return { caption: this._command, description: 'removetwitch <twitch username> - Removes specified twitch user stream alerts from the guild.' };
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
            let arg = args.slice(0).join(" ").trim();
            let twitchName = "";
            if (arg.search("/") >= 0) {
                if (arg.search("twitch") === -1) {
                    return msgObject.reply(`\`${arg}\` is not a valid Twitch channel.`);
                }
                var twitchName2 = arg.split("/");
                if (twitchName2[twitchName2.length - 1] == '') {
                    twitchName = twitchName2[twitchName2.length - 2];
                }
                else {
                    twitchName = twitchName2[twitchName2.length - 1];
                }
            }
            else {
                twitchName = arg;
            }
            const streamers = yield TwitchModel.findOne({ userName: { $regex: new RegExp(twitchName, "i") } });
            const streamerID = yield streamers.userID;
            const guildRecords = yield GuildModel.findOne({ id: msgObject.guild.id });
            if (!guildRecords)
                return;
            const guildStreamers = guildRecords.twitchstreams;
            let newStreamData = guildStreamers.filter(function (e) {
                return e.userID != streamerID;
            });
            const doc = yield GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { twitchstreams: newStreamData } }, { new: true })
                .then(msgObject.reply(`Removed \`${streamers.userName}\` twitch stream from this guild.`));
            const streamerCheck = yield GuildModel.findOne({ "twitchstreams.userID": streamerID });
            if (!streamerCheck) {
                const streamerDelete = yield TwitchModel.findOneAndDelete({ userID: streamerID });
            }
        });
    }
}
exports.default = removetwitch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3ZldHdpdGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3JlbW92ZXR3aXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3RELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBSTlDLE1BQXFCLFlBQVk7SUFBakM7UUFFbUIsYUFBUSxHQUFHLGNBQWMsQ0FBQTtJQWdGNUMsQ0FBQztJQTlFQyxJQUFJO1FBQ0YsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSw4RkFBOEYsRUFBRSxDQUFDO0lBQ2pKLENBQUM7SUFFRCxhQUFhLENBQUMsT0FBZTtRQUMzQixPQUFPLE9BQU8sS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ25DLENBQUM7SUFFSyxVQUFVLENBQUMsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBRSxRQUF1Qjs7WUFFMUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3BCLE9BQU87YUFDUjtZQUVELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQztZQUU1QixJQUFJLGVBQWUsR0FBRyxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDeEgsSUFBSSxlQUFlLEVBQUU7Z0JBQ2pCLGFBQWEsR0FBRyxNQUFNLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFxQyxFQUFFLEVBQUU7b0JBQ3JHLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FB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