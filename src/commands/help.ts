import * as Discord from "discord.js";
import { IBotCommand, IBotCommandHelp } from "../api";

export default class commandsCommand implements IBotCommand {

    private readonly _command = "help"

    help(): IBotCommandHelp {
        return { caption: this._command, description: 'Sends you a list of all our commands' }
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    }

    runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client, commands: IBotCommand[]): void {
        let helpEmbed = new Discord.MessageEmbed()
            .setTitle("Here is a list of our commands")
            .setColor("#ff0000");
        let index = 0;
        for (const cmd of commands) {
            let helpObj = cmd.help();
            helpEmbed.addField(helpObj.caption, helpObj.description);
            index++;
        }
        msgObject.author.send(helpEmbed);
        msgObject.delete({timeout:5000});

    }
}