/*jslint node: true */
'use strict';

var fs = require('fs'),
    linq = require('linq');

module.exports = function (metadata, configuration, options) {
    var self = this;

    self.id = metadata.id;
    self.entryPath = metadata.entryPath;
    self.contentPath = metadata.contentPath;
    self.metaPath = metadata.metaPath;
    self.shortTitle = metadata.shortTitle;
    self.longTitle = metadata.longTitle;
    self.url = options.urls.entry.replace('{slug}', metadata.slug);
    self.date = metadata.date;
    self.slug = metadata.slug;
    self.tags = metadata.tags;
    self.tagNames = linq.from(metadata.tags)
                        .select('$.name')
                        .toArray();

    self.load = function (callback) {
        if (self.content) {
            callback(self, self.content);
        }

        if (!self.content) {
            fs.readFile(self.contentPath, function (err, file) {
                configuration.parseMarkdownContent(
                    file.toString('utf8'),
                    options,
                    function (content) {
                        self.content = content;
                        callback();
                    }
                );
            });
        }
    };

    return self;
};