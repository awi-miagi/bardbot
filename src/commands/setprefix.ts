import * as Discord from "discord.js";
import { IBotCommand, IBotCommandHelp } from "../api";
import * as ConfigFile from "../config";
import fs = require('fs');
const GuildModel = require('../models/Guild');
const { connect } = require('mongoose');


export default class setprefix implements IBotCommand {

    private readonly _command = "setprefix"

    help(): IBotCommandHelp {
        return { caption: this._command, description: 'setprefix <prefix> - Sets the bot\'s prefix.' };
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    }

    async runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client, commands: IBotCommand[]) {

        if (!msgObject.guild) {
            return;
        }

        if (!msgObject.member.hasPermission("ADMINISTRATOR"))
        {
            return;
        }

        let prefix = args.splice(0).join(" ").trim();

        if(prefix == "" || prefix == " ") return;

        const setPrefix = await GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { prefix: prefix } }, { new: true });
        if(setPrefix) return msgObject.reply(`prefix set to \`${setPrefix.prefix}\``);
        
    }
}