'use strict';

var generateFeedXml = function (content, options) {
    var RSS = require('rss'),
        feedOptions = {
            title: options.feed.title,
            description: options.feed.description,
            feed_url: options.urls.feed,
            site_url: options.urls.base,
            image_url: options.urls.favicon,
            author: options.feed.author,
            managingEditor: options.feed.author,
            webMaster: options.feed.author,
            copyright: options.feed.copyright,
            language: options.feed.language,
            categories: content.tags,
            pubDate: content.lastChange,
            ttl: options.feed.ttl
        },
        rss = new RSS(feedOptions);

    content.entries.forEach(function (item) {
        rss.item({
            title: item.longTitle,
            url: item.url,
            description: item.content,
            guid: item.id,
            categories: item.tagNames,
            date: item.date,
            author: options.feed.author
        });
    });

    return rss.xml('\t');
};

module.exports = {
    init : function (engine) {
        engine.getRssXml = function (callback) {
            var items = engine.entries.all.orderedByDate();

            engine.entries.load(items, function () {
                var xml = generateFeedXml({
                        lastChange: engine.entry.latest() ? engine.entry.latest().date : null,
                        entries: items,
                        tags: engine.tags.asNames()
                    }, engine.getOptions());

                callback(xml);
            });
        };
    }
};