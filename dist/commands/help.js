"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
class commandsCommand {
    constructor() {
        this._command = "help";
    }
    help() {
        return { caption: this._command, description: 'Sends you a list of all our commands' };
    }
    isThisCommand(command) {
        return command === this._command;
    }
    runCommand(args, msgObject, client, commands) {
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
        msgObject.delete({ timeout: 5000 });
    }
}
exports.default = commandsCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9oZWxwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXNDO0FBR3RDLE1BQXFCLGVBQWU7SUFBcEM7UUFFcUIsYUFBUSxHQUFHLE1BQU0sQ0FBQTtJQXdCdEMsQ0FBQztJQXRCRyxJQUFJO1FBQ0EsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxzQ0FBc0MsRUFBRSxDQUFBO0lBQzFGLENBQUM7SUFFRCxhQUFhLENBQUMsT0FBZTtRQUN6QixPQUFPLE9BQU8sS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxVQUFVLENBQUMsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBRSxRQUF1QjtRQUNsRyxJQUFJLFNBQVMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUU7YUFDckMsUUFBUSxDQUFDLGdDQUFnQyxDQUFDO2FBQzFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxLQUFLLE1BQU0sR0FBRyxJQUFJLFFBQVEsRUFBRTtZQUN4QixJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDekIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN6RCxLQUFLLEVBQUUsQ0FBQztTQUNYO1FBQ0QsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBRXJDLENBQUM7Q0FDSjtBQTFCRCxrQ0EwQkMifQ==