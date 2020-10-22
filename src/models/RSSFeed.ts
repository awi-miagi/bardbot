const rss = require('mongoose');

const RSSFeed = rss.Schema({
    feedUrl: String,
    feedTitle: String,
    latestDate: Date,
    feedItems: Array
});

module.exports = rss.model('RSSFeed', RSSFeed);