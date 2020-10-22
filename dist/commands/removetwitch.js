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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3ZldHdpdGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3JlbW92ZXR3aXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3RELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBSTlDLE1BQXFCLFlBQVk7SUFBakM7UUFFbUIsYUFBUSxHQUFHLGNBQWMsQ0FBQTtJQTRFNUMsQ0FBQztJQTFFQyxJQUFJO1FBQ0YsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSw4RkFBOEYsRUFBRSxDQUFDO0lBQ2pKLENBQUM7SUFFRCxhQUFhLENBQUMsT0FBZTtRQUMzQixPQUFPLE9BQU8sS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ25DLENBQUM7SUFFSyxVQUFVLENBQUMsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBRSxRQUF1Qjs7WUFFMUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3BCLE9BQU87YUFDUjtZQUVELElBQUksZUFBZSxHQUFHLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSw0QkFBNEIsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN4SCxJQUFJLFdBQVcsR0FBRyxNQUFNLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQztZQUMzRCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUM7WUFFNUIsYUFBYSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFxQyxFQUFFLEVBQUU7Z0JBQ3hFLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxNQUFN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