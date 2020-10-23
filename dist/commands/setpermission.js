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
class setpermission {
    constructor() {
        this._command = "setpermission";
    }
    help() {
        return { caption: this._command, description: 'setpermission <@Role> <command> - Sets a specified role to be able to use a specified command.' };
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
                var isDup = "FALSE";
                isDup = permissions.map((item) => {
                    if (item.command == command && item.role == mentionedRole.id)
                        return 'TRUE';
                }).filter(function (item) { return item; })[0];
                if (isDup)
                    return msgObject.reply(`\`${mentionedRole.name}\` already has permission to \`${command}\``);
                permissionData.push({ command: command, role: mentionedRole });
                const setPermission = yield GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { "commandpermissions": permissionData } }, { new: true });
                if (setPermission)
                    return msgObject.reply(`Added ${mentionedRole.name} to \`${command}\``);
            }
            else {
                msgObject.reply(`\`${validCommands}\` are the only assignable permissions.`);
            }
        });
    }
}
exports.default = setpermission;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0cGVybWlzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9zZXRwZXJtaXNzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUEsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDOUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUd4QyxNQUFxQixhQUFhO0lBQWxDO1FBRXFCLGFBQVEsR0FBRyxlQUFlLENBQUE7SUF1RC9DLENBQUM7SUFyREcsSUFBSTtRQUNBLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsZ0dBQWdHLEVBQUUsQ0FBQztJQUNySixDQUFDO0lBRUQsYUFBYSxDQUFDLE9BQWU7UUFDekIsT0FBTyxPQUFPLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUNyQyxDQUFDO0lBRUssVUFBVSxDQUFDLElBQWMsRUFBRSxTQUEwQixFQUFFLE1BQXNCLEVBQUUsUUFBdUI7O1lBRXhHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFO2dCQUNsQixPQUFPO2FBQ1Y7WUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLEVBQUU7Z0JBQ2xELE9BQU87YUFDVjtZQUVELElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRXJELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdEQsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDO1lBRXhCLElBQUksYUFBYSxHQUFHLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFFekUsSUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNqQyxNQUFNLFNBQVMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUN2RSxJQUFJLENBQUMsU0FBUyxFQUFFO29CQUNaLE1BQU0sV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDL0QsTUFBTSxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQzVCO3FCQUNJO29CQUNELGNBQWMsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUM7aUJBQ2pEO2dCQUNELElBQUksV0FBVyxHQUFHLE1BQU0sU0FBUyxDQUFDLGtCQUFrQixDQUFDO2dCQUNyRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUM7Z0JBRXBCLEtBQUssR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBcUMsRUFBRSxFQUFFO29CQUNoRSxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksYUFBYSxDQUFDLEVBQUU7d0JBQzFELE9BQU8sTUFBTSxDQUFDO2dCQUNsQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFTLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsSUFBRyxLQUFLO29CQUFFLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLGFBQWEsQ0FBQyxJQUFJLGtDQUFrQyxPQUFPLElBQUksQ0FBQyxDQUFDO2dCQUN2RyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztnQkFDL0QsTUFBTSxhQUFhLEdBQUcsTUFBTSxVQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLG9CQUFvQixFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDdkosSUFBSSxhQUFhO29CQUFFLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLGFBQWEsQ0FBQyxJQUFJLFNBQVMsT0FBTyxJQUFJLENBQUMsQ0FBQzthQUM5RjtpQkFDSTtnQkFDRCxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssYUFBYSx5Q0FBeUMsQ0FBQyxDQUFDO2FBQ2hGO1FBSUwsQ0FBQztLQUFBO0NBQ0o7QUF6REQsZ0NBeURDIn0=