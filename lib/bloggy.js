'use strict';

var linq = require('linq'),
    metadata = require('./metadata'),
    BlogEntry = require('./BlogEntry'),
    plugins = [];

module.exports = exports = function () {
    var loadedMetadata,
        options,
        setup = function (opts) {
            options = opts;
        },
        getOptions = function () {
            return options;
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
        loadContent = function (content, callback) {
            throw new Error('Load a markdown parser first!');
        },
        getAllEntries = function () {
            return linq.from(loadedMetadata)
                .select(function (o) { return new BlogEntry(o, methods); })
                .toArray();
        },
        methods = {
            setup : setup,
            getOptions : getOptions,
            load : load,
            loadContent : loadContent,
            getAllEntries : getAllEntries,
            loadEntries : loadEntries
        };

    plugins.forEach(function (plugin) {
        plugin.init(methods);
    });

    return methods;
};

exports.extend = function (plugin) {
    plugins.push(plugin);
};

exports.setMarkdownEngine = function (method) {
    require('./plugins/bloggy-markdown').parseMarkdownContent = method;
};

exports.extend(require('./plugins/bloggy-query'));
exports.extend(require('./plugins/bloggy-markdown'));
exports.extend(require('./plugins/bloggy-rss'));