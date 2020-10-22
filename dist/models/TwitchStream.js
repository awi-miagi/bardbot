"use strict";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHdpdGNoU3RyZWFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZGVscy9Ud2l0Y2hTdHJlYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUUzQyxNQUFNLFlBQVksR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDO0lBQ3ZDLE1BQU0sRUFBRSxNQUFNO0lBQ2QsUUFBUSxFQUFFLE1BQU07SUFDaEIsV0FBVyxFQUFFLE1BQU07SUFDbkIsTUFBTSxFQUFFLE1BQU07SUFDZCxRQUFRLEVBQUUsTUFBTTtJQUNoQixLQUFLLEVBQUUsTUFBTTtJQUNiLFNBQVMsRUFBRSxJQUFJO0lBQ2YsWUFBWSxFQUFFLE1BQU07SUFDcEIsaUJBQWlCLEVBQUUsTUFBTTtDQUM1QixDQUFDLENBQUM7QUFHSCxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDIn0=