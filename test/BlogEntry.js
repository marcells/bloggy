/*global describe, it */
/*eslint-disable max-statements */
'use strict';

var proxyquire = require('proxyquire');

describe('BlogEntry', function () {
    var fsStub = {
            readFile: function (path, callback) {
                callback(null, 'file content');
            }
        },
        BlogEntry = proxyquire('../lib/BlogEntry', {'fs': fsStub}),
        options = {entryUrl: 'http://test.com/{slug}'},
        engine = {
            getOptions: function () {
                return options;
            }
        };

    describe('construction', function () {
        var metadata = {
            id: 'id',
            entryPath: 'entryPath',
            contentPath: 'contentPath',
            metaPath: 'metaPath',
            shortTitle: 'shortTitle',
            longTitle: 'longTitle',
            publish: true,
            date: new Date(2014, 0, 1, 10, 15),
            slug: 'abcdefghi',
            tags: [
                {name: 'tag1'},
                {name: 'tag2'},
                {name: 'tag3'}
            ]
        };

        it('should contain all metadata properties', function () {
            var entry = new BlogEntry(metadata, engine);

            entry.id.should.equal(metadata.id);
            entry.entryPath.should.equal(metadata.entryPath);
            entry.contentPath.should.equal(metadata.contentPath);
            entry.metaPath.should.equal(metadata.metaPath);
            entry.shortTitle.should.equal(metadata.shortTitle);
            entry.longTitle.should.equal(metadata.longTitle);
            entry.publish.should.equal(true);
            entry.date.should.equal(metadata.date);
            entry.slug.should.equal(metadata.slug);
            entry.tags.should.equal(metadata.tags);
        });

        it('should create the url of the BlogEntry', function () {
            var entry = new BlogEntry(metadata, engine);

            entry.url.should.equal('http://test.com/abcdefghi');
        });

        it('should create a list of the tag names', function () {
            var entry = new BlogEntry(metadata, engine);

            entry.tagNames.should.eql([
                'tag1',
                'tag2',
                'tag3'
            ]);
        });
    });

    describe('load()', function () {
        it('should be able to load the file content', function (done) {
            engine.loadContent = function (blogEntry, content, callback) {
                callback('some markdown content');
            };

            var metadata = {},
                entry = new BlogEntry(metadata, engine);

            entry.load(function () {
                entry.content.should.equal('some markdown content');
                done();
            });
        });
    });

    describe('load()', function () {
        it('should cache the loaded content and the parsing operation should only be called once', function (done) {
            var numberOfParsingCalls = 0,
                metadata = {},
                entry;

            engine.loadContent = function (blogEntry, content, callback) {
                numberOfParsingCalls += 1;
                callback('some markdown content');
            };

            entry = new BlogEntry(metadata, engine);

            entry.load(function () {
                entry.load(function () {
                    entry.load(function () {
                        entry.content.should.equal('some markdown content');
                        numberOfParsingCalls.should.equal(1);
                        done();
                    });
                });
            });
        });
    });
});
