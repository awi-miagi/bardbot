const twitchMongoose = require('mongoose');

const TwitchStream = twitchMongoose.Schema({
    userID: String,
    userName: String,
    displayName: String,
    gameID: String,
    streamID: String,
    title: String,
    startedAt: Date,
    thumbnailURL: String,
    profile_image_url: String
});


module.exports = twitchMongoose.model('TwitchStream', TwitchStream);