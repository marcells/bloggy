/*jslint node: true */
'use strict';

var fs = require('fs'),
    linq = require('linq');

module.exports = function (metadata, engine) {
    var self = this,
        options = engine.getOptions();

    self.id = metadata.id;
    self.entryPath = metadata.entryPath;
    self.contentPath = metadata.contentPath;
    self.metaPath = metadata.metaPath;
    self.shortTitle = metadata.shortTitle;
    self.longTitle = metadata.longTitle;
    self.url = options.entryUrl.replace('{slug}', metadata.slug);
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
                engine.loadContent(
                    file.toString('utf8'),
                    function (content) {
                        self.content = content;
                        callback(self, self.content);
                    }
                );
            });
        }
    };

    return self;
};