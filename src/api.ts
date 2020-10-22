import * as Discord from "discord.js";

export interface IBotCommandHelp {
    caption: string
    description: string
    roles?:string[]
}

export interface IBotCommand {
    help(): IBotCommandHelp;
    isThisCommand(command: string): boolean;
    runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client, commands: IBotCommand[]): void;
}