import * as Discord from "discord.js";
import { IBotCommand, IBotCommandHelp } from "../api";
import * as ConfigFile from "../config";
import fs = require('fs');
const GuildModel = require('../models/Guild');
const { connect } = require('mongoose');


export default class setrss implements IBotCommand {

    private readonly _command = "prefix"

    help(): IBotCommandHelp {
        return { caption: this._command, description: 'prefix - Displays the bot\'s prefix for the server.' };
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    }

    async runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client, commands: IBotCommand[]) {

        if (!msgObject.guild) {
            return;
        }

        
        const guildDB = await GuildModel.findOne({ id: msgObject.guild.id });
        if(guildDB) return msgObject.reply(`prefix is currently \`${guildDB.prefix}\``);
    }
}