const guildMongoose = require('mongoose');
import * as ConfigFile from "../config";

const Guild = guildMongoose.Schema({
    id: String,
    prefix: {
        default: ConfigFile.config.prefix,
        type: String
    },
    rssfeeds: Array,
    twitchstreams: Array,
    commandpermissions: Array

});


module.exports = guildMongoose.model('Guild', Guild);