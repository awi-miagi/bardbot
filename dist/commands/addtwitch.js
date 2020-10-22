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
const KeyFile = require("../keys");
const TwitchModel = require('../models/TwitchStream');
const GuildModel = require('../models/Guild');
var axios = require('axios');
class addtwitch {
    constructor() {
        this._command = "addtwitch";
    }
    help() {
        return { caption: this._command, description: 'addtwitch <channel> <twitch username> - Adds a twitch stream to specified channel' };
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
            let arg = args.slice(1).join(" ").trim();
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
            let feeddata = [];
            let response = null;
            const streamers = yield TwitchModel.findOne({ userName: { $regex: new RegExp(twitchName, "i") } });
            if (streamers) {
                let checkGuildDup = yield GuildModel.findOne({ id: msgObject.guild.id, "twitchstreams.userID": streamers.userID });
                if (checkGuildDup)
                    return msgObject.reply(`\`${twitchName}\` is already set for a channel.`);
            }
            var config = {
                method: 'get',
                url: `https://api.twitch.tv/helix/users?login=${twitchName}`,
                headers: {
                    'Client-ID': 'isw50z56dbmt7e1dltydzcwhnsbyq9',
                    'Authorization': 'Bearer ' + KeyFile.key.twitchAccessToken
                }
            };
            const guildCheck = yield GuildModel.findOne({ id: msgObject.guild.id });
            if (!guildCheck) {
                const createGuild = new GuildModel({ id: msgObject.guild.id });
                yield createGuild.save();
            }
            else {
                feeddata = guildCheck.twitchstreams;
            }
            if (!streamers) {
                response = yield axios(config)
                    .catch(function (error) {
                    console.log(error);
                    return error;
                });
                if (response == "Error: Request failed with status code 400")
                    return msgObject.reply(`\`${twitchName}\` is not a valid twitch username or there was a problem with the Twitch API.`);
                if (!response.data.data[0]) {
                    return msgObject.reply(`\`${twitchName}\` is not a valid twitch username.`);
                }
                let checkGuildDup = yield GuildModel.findOne({ id: msgObject.guild.id, "twitchstreams.userID": response.data.data[0].id });
                if (response.data) {
                    let twitchCheck = yield TwitchModel.findOne({ userID: response.data.data[0].id });
                    if (!twitchCheck) {
                        const doc = new TwitchModel({ userID: response.data.data[0].id, userName: response.data.data[0].login, displayName: response.data.data[0].display_name });
                        yield doc.save();
                    }
                    if (!checkGuildDup) {
                        feeddata.push({ userID: response.data.data[0].id, userName: response.data.data[0].login, channelid: channel.id });
                        const doc = yield GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { twitchstreams: feeddata } }, { new: true });
                    }
                    return msgObject.reply(`Added \`${response.data.data[0].display_name}\` twitch stream alerts to \`#${channel.name}\`.`);
                }
            }
            else {
                let checkGuildDup = yield GuildModel.findOne({ id: msgObject.guild.id, "twitchstreams.userID": streamers.userID });
                if (!checkGuildDup) {
                    feeddata.push({ userID: streamers.userID, userName: streamers.userName, channelid: channel.id });
                    const doc = yield GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { twitchstreams: feeddata } }, { new: true });
                }
                return msgObject.reply(`Added \`${streamers.userName}\` twitch stream alerts to \`#${channel.name}\`.`);
            }
        });
    }
}
exports.default = addtwitch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkdHdpdGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2FkZHR3aXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUdBLG1DQUFtQztBQUVuQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUN0RCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUM5QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFJN0IsTUFBcUIsU0FBUztJQUE5QjtRQUVtQixhQUFRLEdBQUcsV0FBVyxDQUFBO0lBcUh6QyxDQUFDO0lBbkhDLElBQUk7UUFDRixPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLG1GQUFtRixFQUFFLENBQUM7SUFDdEksQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUFlO1FBQzNCLE9BQU8sT0FBTyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDbkMsQ0FBQztJQUVLLFVBQVUsQ0FBQyxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFFLFFBQXVCOztZQUUxRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRTtnQkFDcEIsT0FBTzthQUNSO1lBRUQsSUFBSSxlQUFlLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLDRCQUE0QixFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ3hILElBQUksV0FBVyxHQUFHLE1BQU0sZUFBZSxDQUFDLGtCQUFrQixDQUFDO1lBQzNELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQztZQUU1QixhQUFhLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQXFDLEVBQUUsRUFBRTtnQkFDeEUsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO29CQUM5RSxPQUFPLE1BQU0sQ0FBQztZQUNsQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFTLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUdwRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3RFLE9BQU87YUFDUjtZQUNELElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xELElBQUksQ0FBQyxPQUFPO2dCQUFFLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3pDLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUVwQixJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN4QixJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQy9CLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsbUNBQW1DLENBQUMsQ0FBQztpQkFDckU7Z0JBQ0QsSUFBSSxXQUFXLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDakMsSUFBSSxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7b0JBQzdDLFVBQVUsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDbEQ7cUJBQ0k7b0JBQ0gsVUFBVSxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUNsRDthQUNGO2lCQUNJO2dCQUNILFVBQVUsR0FBRyxHQUFHLENBQUM7YUFDbEI7WUFFRCxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDbEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBR3BCLE1BQU0sU0FBUyxHQUFHLE1BQU0sV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFJbkcsSUFBSSxTQUFTLEVBQUU7Z0JBQ2IsSUFBSSxhQUFhLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLHNCQUFzQixFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUNuSCxJQUFJLGFBQWE7b0JBQUUsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssVUFBVSxrQ0FBa0MsQ0FBQyxDQUFBO2FBQzdGO1lBQ0QsSUFBSSxNQUFNLEdBQUc7Z0JBQ1gsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsR0FBRyxFQUFFLDJDQUEyQyxVQUFVLEVBQUU7Z0JBQzVELE9BQU8sRUFBRTtvQkFDUCxXQUFXLEVBQUUsZ0NBQWdDO29CQUM3QyxlQUFlLEVBQUUsU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCO2lCQUMzRDthQUNGLENBQUM7WUFHRixNQUFNLFVBQVUsR0FBRyxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ2YsTUFBTSxXQUFXLEdBQUcsSUFBSSxVQUFVLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUMvRCxNQUFNLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMxQjtpQkFDSTtnQkFDSCxRQUFRLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQzthQUNyQztZQUVELElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2QsUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQztxQkFDM0IsS0FBSyxDQUFDLFVBQVUsS0FBVTtvQkFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbkIsT0FBTyxLQUFLLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDLENBQUM7Z0JBRUwsSUFBSSxRQUFRLElBQUksNENBQTRDO29CQUMxRCxPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxVQUFVLCtFQUErRSxDQUFDLENBQUM7Z0JBQ3pILElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDMUIsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssVUFBVSxvQ0FBb0MsQ0FBQyxDQUFDO2lCQUM3RTtnQkFDRCxJQUFJLGFBQWEsR0FBRyxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsc0JBQXNCLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFFM0gsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO29CQUNqQixJQUFJLFdBQVcsR0FBRyxNQUFNLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtvQkFDakYsSUFBSSxDQUFDLFdBQVcsRUFBRTt3QkFDaEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFXLENBQUMsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7d0JBQzFKLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO3FCQUNsQjtvQkFDRCxJQUFJLENBQUMsYUFBYSxFQUFFO3dCQUNsQixRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDbEgsTUFBTSxHQUFHLEdBQUcsTUFBTSxVQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7cUJBQ2pJO29CQUNELE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksaUNBQWlDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDO2lCQUN6SDthQUNGO2lCQUNJO2dCQUNILElBQUksYUFBYSxHQUFHLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxzQkFBc0IsRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDbkgsSUFBSSxDQUFDLGFBQWEsRUFBRTtvQkFDbEIsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDakcsTUFBTSxHQUFHLEdBQUcsTUFBTSxVQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7aUJBQ2pJO2dCQUNELE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLFNBQVMsQ0FBQyxRQUFRLGlDQUFpQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQzthQUN6RztRQUNILENBQUM7S0FBQTtDQUNGO0FBdkhELDRCQXVIQyJ9