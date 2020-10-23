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
            let guildInfo = yield GuildModel.findOne({ id: msgObject.guild.id });
            if (!guildInfo && !msgObject.member.hasPermission("ADMINISTRATOR"))
                return msgObject.reply("Default twitch channel is not set.");
            ;
            let channel = msgObject.guild.channels.cache.get(guildInfo.defaultTwitchChannelID);
            let mentionedChannel = msgObject.mentions.channels.first();
            if (msgObject.member.hasPermission("ADMINISTRATOR") && mentionedChannel) {
                channel = mentionedChannel;
            }
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
                    'Client-ID': KeyFile.key.twitchClientID,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkdHdpdGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2FkZHR3aXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLG1DQUFtQztBQUNuQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUN0RCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUM5QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFJN0IsTUFBcUIsU0FBUztJQUE5QjtRQUVtQixhQUFRLEdBQUcsV0FBVyxDQUFBO0lBbUl6QyxDQUFDO0lBaklDLElBQUk7UUFDRixPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLG1GQUFtRixFQUFFLENBQUM7SUFDdEksQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUFlO1FBQzNCLE9BQU8sT0FBTyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDbkMsQ0FBQztJQUVLLFVBQVUsQ0FBQyxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFFLFFBQXVCOztZQUUxRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRTtnQkFDcEIsT0FBTzthQUNSO1lBRUQsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDO1lBRTVCLElBQUksZUFBZSxHQUFHLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSw0QkFBNEIsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN4SCxJQUFJLGVBQWUsRUFBRTtnQkFDakIsYUFBYSxHQUFHLE1BQU0sZUFBZSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQXFDLEVBQUUsRUFBRTtvQkFDckcsSUFBSSxJQUFJLENBQUMs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