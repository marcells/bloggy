/*jslint node: true */
'use strict';

var marked = require('marked');

marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

var parseMarkdownContent = function (markdownContent, options, callback) {
    marked(markdownContent, function (err, content) {
        if (err) { throw err; }
        callback(content);
    });
};

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
            url: options.urls.entry.replace('{slug}', item.slug),
            description: item.content,
            guid: item.id,
            categories: item.tagNames,
            date: item.date,
            author: options.feed.author
        });
    });

    return rss.xml('\t');
};

exports.preset = function () {
    return {
        parseMarkdownContent: parseMarkdownContent,
        generateFeedXml: generateFeedXml
    };
};