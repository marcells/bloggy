/*global describe, it */
"use strict";

var BlogEntry = require('../lib/BlogEntry');

describe('BlogEntry', function () {
    describe('construction', function () {
        var metadata = {
            id: "id",
            entryPath: "entryPath",
            contentPath: "contentPath",
            metaPath: "metaPath",
            shortTitle: "shortTitle",
            longTitle: "longTitle",
            date: new Date(2014, 0, 1, 10, 15),
            slug: "abcdefghi",
            tags: [ { name : "tag1" }, { name: "tag2" }, { name: "tag3" }],
            tagNames: [ "tag1", "tag2" ]
        };

        it('should wrap the metadata properties', function () {
            var entry = new BlogEntry(metadata);

            entry.id.should.equal(metadata.id);
            entry.entryPath.should.equal(metadata.entryPath);
            entry.contentPath.should.equal(metadata.contentPath);
            entry.metaPath.should.equal(metadata.metaPath);
            entry.shortTitle.should.equal(metadata.shortTitle);
            entry.longTitle.should.equal(metadata.longTitle);
            entry.date.should.equal(metadata.date);
            entry.slug.should.equal(metadata.slug);
            entry.tags.should.equal(metadata.tags);
        });

        it('should create the correct tag names', function () {
            var entry = new BlogEntry(metadata);

            entry.tagNames.should.eql([ "tag1", "tag2", "tag3" ]);
        });
    });
});