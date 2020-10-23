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
const { connect } = require('mongoose');
class setdefaulttwitch {
    constructor() {
        this._command = "setdefaulttwitch";
    }
    help() {
        return { caption: this._command, description: 'setdefaulttwitch <#channel> - Sets twitch\'s default alert channel' };
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
            let mentionedChannel = msgObject.mentions.channels.first();
            if (!mentionedChannel)
                return msgObject.reply(`You did not mention a channel.`);
            const setChannel = yield GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { defaultTwitchChannelID: mentionedChannel } }, { new: true });
            if (setChannel)
                return msgObject.reply(`Default twitch channel set to \`#${mentionedChannel.name}\``);
        });
    }
}
exports.default = setdefaulttwitch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0ZGVmYXVsdHR3aXRjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9zZXRkZWZhdWx0dHdpdGNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUEsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDOUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUd4QyxNQUFxQixnQkFBZ0I7SUFBckM7UUFFcUIsYUFBUSxHQUFHLGtCQUFrQixDQUFBO0lBOEJsRCxDQUFDO0lBNUJHLElBQUk7UUFDQSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLG9FQUFvRSxFQUFFLENBQUM7SUFDekgsQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUFlO1FBQ3pCLE9BQU8sT0FBTyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDckMsQ0FBQztJQUVLLFVBQVUsQ0FBQyxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFFLFFBQXVCOztZQUV4RyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRTtnQkFDbEIsT0FBTzthQUNWO1lBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxFQUNwRDtnQkFDSSxPQUFPO2FBQ1Y7WUFFRCxJQUFJLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzNELElBQUcsQ0FBQyxnQkFBZ0I7Z0JBQUUsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7WUFJL0UsTUFBTSxVQUFVLEdBQUcsTUFBTSxVQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLHNCQUFzQixFQUFFLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3hKLElBQUcsVUFBVTtnQkFBRSxPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsb0NBQW9DLGdCQUFnQixDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7UUFFekcsQ0FBQztLQUFBO0NBQ0o7QUFoQ0QsbUNBZ0NDIn0=