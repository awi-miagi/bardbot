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
class twitchlist {
    constructor() {
        this._command = "twitchlist";
    }
    help() {
        return { caption: this._command, description: 'twitchlist - Lists twitch stream alerts this guild is subscribed to.' };
    }
    isThisCommand(command) {
        return command === this._command;
    }
    runCommand(args, msgObject, client, commands) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!msgObject.guild) {
                return;
            }
            let guildInfo = yield GuildModel.findOne({ id: msgObject.guild.id });
            if (!guildInfo)
                return;
            let guildStreamers = guildInfo.twitchstreams;
            let streamersArray = new Array();
            let x = 0;
            if (guildStreamers.length > 0) {
                guildStreamers.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                    let channelName = msgObject.guild.channels.cache.get(element.channelid).name;
                    let streamers = yield TwitchModel.findOne({ "userID": element.userID });
                    let streamersName = yield streamers.userName;
                    msgObject.channel.send(`${streamersName} - #${channelName}`);
                }));
            }
        });
    }
}
exports.default = twitchlist;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHdpdGNobGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy90d2l0Y2hsaXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUEsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDdEQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFHOUMsTUFBcUIsVUFBVTtJQUEvQjtRQUVtQixhQUFRLEdBQUcsWUFBWSxDQUFBO0lBcUQxQyxDQUFDO0lBbkRDLElBQUk7UUFDRixPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLHNFQUFzRSxFQUFFLENBQUM7SUFDekgsQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUFlO1FBQzNCLE9BQU8sT0FBTyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDbkMsQ0FBQztJQUVLLFVBQVUsQ0FBQyxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFFLFFBQXVCOztZQUUxRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRTtnQkFDcEIsT0FBTzthQUNSO1lBR0QsSUFBSSxTQUFTLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNyRSxJQUFJLENBQUMsU0FBUztnQkFBRSxPQUFPO1lBQ3ZCLElBQUksY0FBYyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUM7WUFDN0MsSUFBSSxjQUFjLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFHVixJQUFJLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUM3QixjQUFjLENBQUMsT0FBTyxDQUFDLENBQU8sT0FBWSxFQUFFLEVBQUU7b0JBQzVDLElBQUksV0FBVyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDN0UsSUFBSSxTQUFTLEdBQUcsTUFBTSxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO29CQUN4RSxJQUFJLGFBQWEsR0FBRyxNQUFNLFNBQVMsQ0FBQyxRQUFRLENBQUE7b0JBRTVDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsYUFBYSxPQUFPLFdBQVcsRUFBRSxDQUFDLENBQUM7Z0JBRS9ELENBQUMsQ0FBQSxDQUFDLENBQUM7YUFDSjtRQW1CSCxDQUFDO0tBQUE7Q0FDRjtBQXZERCw2QkF1REMifQ==