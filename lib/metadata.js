/*jslint node: true */
'use strict';

var fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    slug = require('slug'),
    linq = require('linq');

var parseDate = function (dateAsString) {
    var split = dateAsString.split('-');
    return new Date(split[0], split[1] - 1, split[2], split[3], split[4]);
};

exports.load = function (options, callback) {
    glob('**/' + (options.meta || 'meta.json'), { root: options.baseDirectory }, function (err, results) {
        var metadata = [];

        results.forEach(function (result) {
            var dir = path.dirname(result),
                meta = JSON.parse(fs.readFileSync(result).toString('utf8'));

            meta.id = path.basename(dir);
            meta.entryPath = path.resolve(dir);
            meta.contentPath = path.resolve(path.join(dir, (options.content || 'content.md')));
            meta.metaPath = path.resolve(result);
            meta.date = parseDate(path.basename(dir));
            meta.slug = slug(meta.longTitle);
            meta.tags = linq
                .from(meta.tags)
                .select(function (o) {
                    return {
                        name: o,
                        slug: slug(o)
                    };
                })
                .toArray();

            metadata.push(meta);
        });

        callback(metadata);
    });
};