/*jslint node: true */
'use strict';

var linq = require('linq'),
    metadata = require('./metadata'),
    defaults = require('./defaults'),
    BlogEntry = require('./BlogEntry'),
    plugins = [];

exports.extend = function (plugin) {
    plugins.push(plugin);
};

exports.extend(require('./plugins/bloggy-query'));
exports.extend(require('./plugins/bloggy-rss'));

module.exports = function () {
    var loadedMetadata,
        options,
        configuration = defaults.preset(),
        setup = function (opts) {
            options = opts;
        },
        getOptions = function () {
            return options;
        },
        getConfiguration = function () {
            return configuration;
        },
        getAllEntries = function () {
            return linq.from(loadedMetadata)
                .select(function (o) { return new BlogEntry(o, getConfiguration(), getOptions()); })
                .toArray();
        },
        loadEntries = function (entries, callback) {
            var i = 0;

            entries.forEach(function (entry) {
                entry.load(function (e, content) {
                    i += 1;

                    if (i === entries.length) {
                        callback();
                    }
                });
            });
        },
        load = function (callback) {
            metadata.load(getOptions().baseDirectory, function (metadata) {
                loadedMetadata = metadata;
                callback();
            });
        },
        methods = {
            setup : setup,
            getConfiguration : getConfiguration,
            getOptions : getOptions,
            load : load,
            getAllEntries : getAllEntries,
            loadEntries : loadEntries
        };

    plugins.forEach(function (plugin) {
        plugin.init(methods);
    });

    return methods;
};