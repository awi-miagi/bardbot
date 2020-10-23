import * as Discord from "discord.js";
import { IBotCommand, IBotCommandHelp } from "../api";
const RSSFeedModel = require('../models/RSSFeed');
const GuildModel = require('../models/Guild');


export default class removerss implements IBotCommand {

    private readonly _command = "removerss"

    help(): IBotCommandHelp {
        return { caption: this._command, description: 'removerss <RSS URL> - Removes an RSS Feed from the guild.' };
    }

    isThisCommand(command: string): boolean {
        return command === this._command;
    }

    async runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client, commands: IBotCommand[]) {

        if (!msgObject.guild) {
            return;
        }

        let hasPermission = "FALSE";

        let permissionGuild = await GuildModel.findOne({ id: msgObject.guild.id, "commandpermissions.command": this._command });
        if (permissionGuild) {
            hasPermission = await permissionGuild.commandpermissions.map((item: { command: any; role: string; }) => {
              if (item.command == this._command && msgObject.member.roles.cache.has(item.role))
                return 'TRUE';
            }).filter(function (item: any) { return item; })[0];
        }
    
        if (msgObject.member.hasPermission("ADMINISTRATOR")) {
          hasPermission = "TRUE";
        }
    
        if (hasPermission != "TRUE") {
          return;
        }

        let feedUrl = args.splice(0).join(" ");

        //get guilds feeds
        const guildRecords = await GuildModel.findOne({ id: msgObject.guild.id });
        if (!guildRecords) return;

        const guildFeeds = guildRecords.rssfeeds;

        let newFeedData = guildFeeds.filter(function (e: { feedUrl: string; }) {
            return e.feedUrl != feedUrl;
        });


        //update guilds rss feeds
        const doc = await GuildModel.findOneAndUpdate({ id: msgObject.guild.id }, { $set: { rssfeeds: newFeedData } }, { new: true })
            .then(msgObject.reply(`Removed \`${feedUrl}\` RSS Feed from this guild.`));

        //Check if any guild is using this feed, otherwise delete them from the rssfeeds table.
        const feedCheck = await GuildModel.findOne({ "rssfeeds.feedUrl": feedUrl });
        if (!feedCheck) {
            const feedDelete = await RSSFeedModel.findOneAndDelete({ feedUrl: feedUrl });
        }

    }
}