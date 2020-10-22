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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvY29tbWFuZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBc0M7QUFHdEMsTUFBcUIsZUFBZTtJQUFwQztRQUVxQixhQUFRLEdBQUcsTUFBTSxDQUFBO0lBd0J0QyxDQUFDO0lBdEJHLElBQUk7UUFDQSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLHNDQUFzQyxFQUFFLENBQUE7SUFDMUYsQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUFlO1FBQ3pCLE9BQU8sT0FBTyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDckMsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFFLFFBQXVCO1FBQ2xHLElBQUksU0FBUyxHQUFHLElBQUksT0FBTyxDQUFDLFlBQVksRUFBRTthQUNyQyxRQUFRLENBQUMsZ0NBQWdDLENBQUM7YUFDMUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLEtBQUssTUFBTSxHQUFHLElBQUksUUFBUSxFQUFFO1lBQ3hCLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN6QixTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3pELEtBQUssRUFBRSxDQUFDO1NBQ1g7UUFDRCxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUM7SUFFckMsQ0FBQztDQUNKO0FBMUJELGtDQTBCQyJ9