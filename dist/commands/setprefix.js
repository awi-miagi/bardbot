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
class setprefix {
    constructor() {
        this._command = "setprefix";
    }
    help() {
        return { caption: this._command, description: 'setprefix <prefix> - Sets the bot\'s prefix.' };
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
            let prefix = args.splice(0).join(" ").trim();
            if (prefix == "" || prefix == " ")
                return;
            const setPrefix = yield GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { prefix: prefix } }, { new: true });
            if (setPrefix)
                return msgObject.reply(`prefix set to \`${setPrefix.prefix}\``);
        });
    }
}
exports.default = setprefix;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0cHJlZml4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3NldHByZWZpeC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFHeEMsTUFBcUIsU0FBUztJQUE5QjtRQUVxQixhQUFRLEdBQUcsV0FBVyxDQUFBO0lBNkIzQyxDQUFDO0lBM0JHLElBQUk7UUFDQSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLDhDQUE4QyxFQUFFLENBQUM7SUFDbkcsQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUFlO1FBQ3pCLE9BQU8sT0FBTyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDckMsQ0FBQztJQUVLLFVBQVUsQ0FBQyxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFFLFFBQXVCOztZQUV4RyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRTtnQkFDbEIsT0FBTzthQUNWO1lBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxFQUNwRDtnQkFDSSxPQUFPO2FBQ1Y7WUFFRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUU3QyxJQUFHLE1BQU0sSUFBSSxFQUFFLElBQUksTUFBTSxJQUFJLEdBQUc7Z0JBQUUsT0FBTztZQUV6QyxNQUFNLFNBQVMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUM3SCxJQUFHLFNBQVM7Z0JBQUUsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLG1CQUFtQixTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztRQUVsRixDQUFDO0tBQUE7Q0FDSjtBQS9CRCw0QkErQkMifQ==