import * as Discord from "discord.js";
import { IBotCommand, IBotCommandHelp } from "../api";
const GuildModel = require('../models/Guild');
const { connect } = require('mongoose');


export default class unsetpermission implements IBotCommand {

    private readonly _command = "unsetpermission"

    help(): IBotCommandHelp {
        return { caption: this._command, description: 'unsetpermission <@Role> <command> - Unsets a specific command from the role.' };
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    }

    async runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client, commands: IBotCommand[]) {

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
            const guildData = await GuildModel.findOne({ id: msgObject.guild.id });
            if (!guildData) {
                const createGuild = new GuildModel({ id: msgObject.guild.id });
                await createGuild.save();
            }
            else {
                permissionData = guildData.commandpermissions;
            }
            let permissions = await guildData.commandpermissions;

            let newRoleData = permissions.filter(function (e: { role: Discord.Role; command: string; }) {
                return !(e.role == mentionedRole && e.command == command)
            });

            if (newRoleData) {
                const setPermission = await GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { "commandpermissions": newRoleData } }, { new: true });
                if (setPermission) return msgObject.reply(`Removed ${mentionedRole.name} from \`${command}\``);
            }
        }
        else {
            msgObject.reply(`\`${validCommands}\` are the only valid permissions.`);
        }



    }
}