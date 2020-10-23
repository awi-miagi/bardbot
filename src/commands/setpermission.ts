import * as Discord from "discord.js";
import { IBotCommand, IBotCommandHelp } from "../api";
const GuildModel = require('../models/Guild');
const { connect } = require('mongoose');


export default class setpermission implements IBotCommand {

    private readonly _command = "setpermission"

    help(): IBotCommandHelp {
        return { caption: this._command, description: 'setpermission <@Role> <command> - Sets a specified role to be able to use a specified command.' };
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
            var isDup = "FALSE";
        
            isDup = permissions.map((item: { command: any; role: string; }) => {
              if (item.command == command && item.role == mentionedRole.id)
                return 'TRUE';
            }).filter(function (item: any) { return item; })[0];
            if(isDup) return msgObject.reply(`\`${mentionedRole.name}\` already has permission to \`${command}\``);
            permissionData.push({ command: command, role: mentionedRole });
            const setPermission = await GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { "commandpermissions": permissionData } }, { new: true });
            if (setPermission) return msgObject.reply(`Added ${mentionedRole.name} to \`${command}\``);
        }
        else {
            msgObject.reply(`\`${validCommands}\` are the only assignable permissions.`);
        }



    }
}