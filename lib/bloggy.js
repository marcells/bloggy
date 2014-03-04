'use strict';

var linq = require('linq'),
    metadata = require('./metadata'),
    BlogEntry = require('./BlogEntry');

module.exports = function () {
    var loadedMetadata,
        options,
        methods,
        plugins = [],
        extendWith = function (plugin) {
            plugins.push(plugin);
            plugin.init(methods);
        },
        setup = function (opts) {
            options = opts;
        },
        getOptions = function () {
            return options;
        },
        loadEntries = function (entries, callback) {
            var i = 0;

            if (entries.length === 0) {
                callback();
            }

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
            metadata.load(getOptions(), function (metadata) {
                loadedMetadata = metadata;
                callback();
            });
        },
        loadContent = function (content, callback) {
            throw new Error('Load a parser like bloggy-marked first!');
        },
        getAllEntries = function () {
            return linq.from(loadedMetadata)
                .select(function (o) { return new BlogEntry(o, methods); })
                .toArray();
        };

    methods = {
        setup : setup,
        getOptions : getOptions,
        load : load,
        loadContent : loadContent,
        getAllEntries : getAllEntries,
        loadEntries : loadEntries,
        extendWith : extendWith
    };

    return methods;
};