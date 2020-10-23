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
class unsetpermission {
    constructor() {
        this._command = "unsetpermission";
    }
    help() {
        return { caption: this._command, description: 'unsetpermission <@Role> <command> - Unsets a specific command from the role.' };
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
            let mentionedRole = msgObject.mentions.roles.first();
            let command = args.splice(1).toString().toLowerCase();
            let permissionData = [];
            let validCommands = ['addrss', 'addtwitch', 'removerss', 'removetwitch'];
            if (validCommands.includes(command)) {
                const guildData = yield GuildModel.findOne({ id: msgObject.guild.id });
                if (!guildData) {
                    const createGuild = new GuildModel({ id: msgObject.guild.id });
                    yield createGuild.save();
                }
                else {
                    permissionData = guildData.commandpermissions;
                }
                let permissions = yield guildData.commandpermissions;
                let newRoleData = permissions.filter(function (e) {
                    return !(e.role == mentionedRole && e.command == command);
                });
                if (newRoleData) {
                    const setPermission = yield GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { "commandpermissions": newRoleData } }, { new: true });
                    if (setPermission)
                        return msgObject.reply(`Removed ${mentionedRole.name} from \`${command}\``);
                }
            }
            else {
                msgObject.reply(`\`${validCommands}\` are the only valid permissions.`);
            }
        });
    }
}
exports.default = unsetpermission;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5zZXRwZXJtaXNzaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3Vuc2V0cGVybWlzc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFHeEMsTUFBcUIsZUFBZTtJQUFwQztRQUVxQixhQUFRLEdBQUcsaUJBQWlCLENBQUE7SUFzRGpELENBQUM7SUFwREcsSUFBSTtRQUNBLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsOEVBQThFLEVBQUUsQ0FBQztJQUNuSSxDQUFDO0lBRUQsYUFBYSxDQUFDLE9BQWU7UUFDekIsT0FBTyxPQUFPLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUNyQyxDQUFDO0lBRUssVUFBVSxDQUFDLElBQWMsRUFBRSxTQUEwQixFQUFFLE1BQXNCLEVBQUUsUUFBdUI7O1lBRXhHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFO2dCQUNsQixPQUFPO2FBQ1Y7WUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLEVBQUU7Z0JBQ2xELE9BQU87YUFDVjtZQUVELElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRXJELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdEQsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDO1lBRXhCLElBQUksYUFBYSxHQUFHLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFFekUsSUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNqQyxNQUFNLFNBQVMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUN2RSxJQUFJLENBQUMsU0FBUyxFQUFFO29CQUNaLE1BQU0sV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDL0QsTUFBTSxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQzVCO3FCQUNJO29CQUNELGNBQWMsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUM7aUJBQ2pEO2dCQUNELElBQUksV0FBVyxHQUFHLE1BQU0sU0FBUyxDQUFDLGtCQUFrQixDQUFDO2dCQUVyRCxJQUFJLFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBMkM7b0JBQ3RGLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksYUFBYSxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUE7Z0JBQzdELENBQUMsQ0FBQyxDQUFDO2dCQUVILElBQUksV0FBVyxFQUFFO29CQUNiLE1BQU0sYUFBYSxHQUFHLE1BQU0sVUFBVSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxvQkFBb0IsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7b0JBQ3BKLElBQUksYUFBYTt3QkFBRSxPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxhQUFhLENBQUMsSUFBSSxXQUFXLE9BQU8sSUFBSSxDQUFDLENBQUM7aUJBQ2xHO2FBQ0o7aUJBQ0k7Z0JBQ0QsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLGFBQWEsb0NBQW9DLENBQUMsQ0FBQzthQUMzRTtRQUlMLENBQUM7S0FBQTtDQUNKO0FBeERELGtDQXdEQyJ9