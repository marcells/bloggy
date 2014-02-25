'use strict';

var linq = require('linq');

module.exports = {
    init : function (engine) {
        var getAllEntriesOrderedByDate = function () {
                return linq.from(engine.getAllEntries())
                    .orderByDescending("$.date")
                    .toArray();
            },
            getAllEntriesOrderedByName = function () {
                return linq.from(engine.getAllEntries())
                    .orderBy("$.longTitle")
                    .toArray();
            },
            getEntryByShortTitle = function (shortTitle) {
                return linq.from(engine.getAllEntries())
                    .singleOrDefault(function (o) { return o.shortTitle === shortTitle; });
            },
            getEntryBySlug = function (slug) {
                return linq.from(engine.getAllEntries())
                    .singleOrDefault(function (o) { return o.slug === slug; });
            },
            getAllTags = function () {
                return linq.from(engine.getAllEntries())
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
                return linq.from(engine.getAllEntries())
                    .where(function (o) {
                        return linq
                            .from(o.tags)
                            .contains(tagSlug, '$.slug');
                    })
                    .toArray();
            },
            getLatestEntry = function () {
                return linq.from(engine.getAllEntries())
                    .orderByDescending('$.date')
                    .firstOrDefault();
            };

        engine.entry = {
            bySlug: getEntryBySlug,
            byShortTitle: getEntryByShortTitle,
            latest: getLatestEntry
        };

        engine.entries = {
            all: {
                orderedByName: getAllEntriesOrderedByName,
                orderedByDate: getAllEntriesOrderedByDate
            },
            byTagSlug: getEntriesByTagSlug,
            load: engine.loadEntries
        };

        engine.tags = {
            all: getAllTags,
            asNames: getAllTagNames
        };
    }
};