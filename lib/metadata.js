/*jslint node: true */
'use strict';

var fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    slug = require('slug'),
    linq = require('linq'),
    constants = require('./constants');

var parseDate = function (dateAsString) {
    var split = dateAsString.split('-');
    return new Date(split[0], split[1] - 1, split[2], split[3], split[4]);
};

var loadMetadataInDirectory = function (options, baseDirectory, callback) {
    glob('**/' + constants.DEFAULT_METADATA_FILENAME, {cwd: baseDirectory}, function (err, results) {
        var metadata = [];

        results.forEach(function (result) {
            result = path.join(baseDirectory, result);

            var dir = path.dirname(result),
                meta = JSON.parse(fs.readFileSync(result).toString('utf8'));

            meta.id = path.basename(dir);
            meta.entryPath = path.resolve(dir);
            meta.contentPath = path.resolve(path.join(dir, options.contentFilename || constants.DEFAULT_CONTENT_FILENAME));
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

exports.load = function (options, callback) {
    var allMetadata = [],
        numberOfScannedDirectories = 0;

    options.baseDirectories.forEach(function (option) {
        loadMetadataInDirectory(options, option, function (metadata) {
            allMetadata = allMetadata.concat(metadata);
            numberOfScannedDirectories += 1;

            if (numberOfScannedDirectories === options.baseDirectories.length) {
                callback(allMetadata);
            }
        });
    });

    if (options.baseDirectories.length === 0) {
        callback(allMetadata);
    }
};
