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
const TwitchModel = require('../models/TwitchStream');
class setrss {
    constructor() {
        this._command = "twitchnotice";
    }
    help() {
        return { caption: this._command, description: 'Sends twitch streamer notices to the channel the command is issued in.' };
    }
    isThisCommand(command) {
        return command === this._command;
    }
    runCommand(args, msgObject, client, commands) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!msgObject.guild) {
                return;
            }
            if (!msgObject.member.hasPermission("MANAGE_CHANNELS")) {
                return;
            }
            let twitchName = args.splice(0).join(" ").toLowerCase();
            let feeddata = [];
            const req = yield TwitchModel.findOne({ userName: { $regex: new RegExp(twitchName, "i") } });
            if (!req)
                return msgObject.reply(`that twitch user does not exist in the database.`);
            const checkDup = yield GuildModel.findOne({ id: msgObject.guild.id, "twitchstreams.userID": req.userID });
            if (checkDup)
                return msgObject.reply(`\`${twitchName}\` is already set for this channel.`);
            const req2 = yield GuildModel.findOne({ id: msgObject.guild.id });
            if (!req2) {
                const createGuild = new GuildModel({ id: msgObject.guild.id });
                yield createGuild.save();
            }
            else {
                feeddata = req2.twitchstreams;
            }
            let currDate = new Date();
            feeddata.push({ userID: req.userID, channelid: msgObject.channel.id });
            const doc = yield GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { twitchstreams: feeddata } }, { new: true });
            return msgObject.reply(`Added \`${req.userName}\` twitch stream alerts to this channel.`);
        });
    }
}
exports.default = setrss;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHdpdGNobm90aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3R3aXRjaG5vdGljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUlBLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBSXRELE1BQXFCLE1BQU07SUFBM0I7UUFFcUIsYUFBUSxHQUFHLGNBQWMsQ0FBQTtJQTZDOUMsQ0FBQztJQTNDRyxJQUFJO1FBQ0EsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSx3RUFBd0UsRUFBRSxDQUFDO0lBQzdILENBQUM7SUFFRCxhQUFhLENBQUMsT0FBZTtRQUN6QixPQUFPLE9BQU8sS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3JDLENBQUM7SUFFSyxVQUFVLENBQUMsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBRSxRQUF1Qjs7WUFFeEcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2xCLE9BQU87YUFDVjtZQUVELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUN0RDtnQkFDSSxPQUFPO2FBQ1Y7WUFFRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN4RCxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFFbEIsTUFBTSxHQUFHLEdBQUcsTUFBTSxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFHLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5RixJQUFJLENBQUMsR0FBRztnQkFBRSxPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQztZQUVyRixNQUFNLFFBQVEsR0FBRyxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsc0JBQXNCLEVBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDM0csSUFBRyxRQUFRO2dCQUFFLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLFVBQVUscUNBQXFDLENBQUMsQ0FBQTtZQUV6RixNQUFNLElBQUksR0FBRyxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2xFLElBQUcsQ0FBQyxJQUFJLEVBQ1I7Z0JBQ0ksTUFBTSxXQUFXLEdBQUcsSUFBSSxVQUFVLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDO2dCQUM5RCxNQUFNLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUM1QjtpQkFFRDtnQkFDSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQzthQUNqQztZQUNELElBQUksUUFBUSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDMUIsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdkUsTUFBTSxHQUFHLEdBQUcsTUFBTSxVQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDaEksT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxDQUFDLFFBQVEsMENBQTBDLENBQUMsQ0FBQztRQUM5RixDQUFDO0tBQUE7Q0FDSjtBQS9DRCx5QkErQ0MifQ==