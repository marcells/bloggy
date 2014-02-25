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
        getAllEntriesOrderedByDate = function () {
            return linq.from(getAllEntries())
                .orderByDescending("$.date")
                .toArray();
        },
        getAllEntriesOrderedByName = function () {
            return linq.from(getAllEntries())
                .orderBy("$.longTitle")
                .toArray();
        },
        getEntryByShortTitle = function (shortTitle) {
            return linq.from(getAllEntries())
                .singleOrDefault(function (o) { return o.shortTitle === shortTitle; });
        },
        getEntryBySlug = function (slug) {
            return linq.from(getAllEntries())
                .singleOrDefault(function (o) { return o.slug === slug; });
        },
        getAllTags = function () {
            return linq.from(getAllEntries())
                .selectMany('$.tags')
                .groupBy('{ name: $.name, slug: $.slug }', null, '{ tag: $, count: $$.count() }', '$.name')
                .orderByDescending('$.count')
                .toArray();
        },
        getAllTagNames = function () {
            return linq.from(getAllTags())
                .select('$.tag.name')
                .toArray();
        },
        getEntriesByTagSlug = function (tagSlug) {
            return linq.from(getAllEntries())
                .where(function (o) {
                    return linq
                        .from(o.tags)
                        .contains(tagSlug, '$.slug');
                })
                .toArray();
        },
        getLatestEntry = function () {
            return linq.from(getAllEntries())
                .orderByDescending('$.date')
                .firstOrDefault();
        },
        loadByEntries = function (entries, callback) {
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
            entry : {
                bySlug: getEntryBySlug,
                byShortTitle: getEntryByShortTitle,
                latest: getLatestEntry
            },
            entries : {
                all: {
                    orderedByName: getAllEntriesOrderedByName,
                    orderedByDate: getAllEntriesOrderedByDate
                },
                byTagSlug: getEntriesByTagSlug,
                load: loadByEntries
            },
            tags : {
                all: getAllTags,
                asNames: getAllTagNames
            }
        };

    plugins.forEach(function (plugin) {
        plugin.init(methods);
    });

    return methods;
};