/*jslint node: true */
'use strict';

var fs = require('fs'),
    linq = require('linq'),
    copyProperties = function (from, to) {
        var property;

        for (property in from) {
            if (from.hasOwnProperty(property)) {
                to[property] = from[property];
            }
        }
    };

module.exports = function (metadata, engine) {
    var self = this,
        options = engine.getOptions();

    copyProperties(metadata, self);

    self.url = options.entryUrl.replace('{slug}', metadata.slug);
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
                    self,
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