"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guildMongoose = require('mongoose');
const ConfigFile = require("../config");
const Guild = guildMongoose.Schema({
    id: String,
    prefix: {
        default: ConfigFile.config.prefix,
        type: String
    },
    rssfeeds: Array,
    twitchstreams: Array,
    commandpermissions: Array,
    defaultTwitchChannelID: String
});
module.exports = guildMongoose.model('Guild', Guild);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3VpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL0d1aWxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzFDLHdDQUF3QztBQUV4QyxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDO0lBQy9CLEVBQUUsRUFBRSxNQUFNO0lBQ1YsTUFBTSxFQUFFO1FBQ0osT0FBTyxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTTtRQUNqQyxJQUFJLEVBQUUsTUFBTTtLQUNmO0lBQ0QsUUFBUSxFQUFFLEtBQUs7SUFDZixhQUFhLEVBQUUsS0FBSztJQUNwQixrQkFBa0IsRUFBRSxLQUFLO0lBQ3pCLHNCQUFzQixFQUFFLE1BQU07Q0FFakMsQ0FBQyxDQUFDO0FBR0gsTUFBTSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyJ9