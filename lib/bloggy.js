/*jslint node: true */
'use strict';

var linq = require('linq'),
    metadata = require('./metadata'),
    defaults = require('./defaults'),
    BlogEntry = require('./BlogEntry');

module.exports = function () {
    var loadedMetadata,
        options,
        configuration = defaults.preset(),
        getAllEntries = function () {
            return linq.from(loadedMetadata)
                .select(function (o) { return new BlogEntry(o, configuration, options); })
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
                .single(function (o) { return o.shortTitle === shortTitle; });
        },
        getEntryBySlug = function (slug) {
            return linq.from(getAllEntries())
                .single(function (o) { return o.slug === slug; });
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
            metadata.load(options.baseDirectory, function (metadata) {
                loadedMetadata = metadata;
                callback();
            });
        },
        setup = function (opts) {
            options = opts;
        },
        getRssXml = function (callback) {
            var items = getAllEntriesOrderedByDate();

            loadByEntries(items, function () {
                var xml = configuration.generateFeedXml({
                        lastChange: getLatestEntry() ? getLatestEntry().date : null,
                        entries: items,
                        tags: getAllTagNames()
                    }, options);

                callback(xml);
            });
        };

    return {
        setup : setup,
        configuration : configuration,
        getRssXml : getRssXml,
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
};