import * as Discord from "discord.js";
import { IBotCommand, IBotCommandHelp } from "../api";
const GuildModel = require('../models/Guild');
const { connect } = require('mongoose');


export default class setdefaulttwitch implements IBotCommand {

    private readonly _command = "setdefaulttwitch"

    help(): IBotCommandHelp {
        return { caption: this._command, description: 'setdefaulttwitch <#channel> - Sets twitch\'s default alert channel' };
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

        let mentionedChannel = msgObject.mentions.channels.first();
        if(!mentionedChannel) return msgObject.reply(`You did not mention a channel.`);



        const setChannel = await GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { defaultTwitchChannelID: mentionedChannel } }, { new: true });
        if(setChannel) return msgObject.reply(`Default twitch channel set to \`#${mentionedChannel.name}\``);
        
    }
}