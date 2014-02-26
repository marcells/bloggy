/*global describe, it, beforeEach */
"use strict";

var proxyquire = require('proxyquire'),
    should = require('should');

describe('bloggy', function () {
    var metadataStub = {
            load: function (baseDirectory, callback) {
                callback([{
                    id: '2000-1-1-12-00',
                    entryPath: '/content',
                    contentPath: '/content/2000-1-1-12-00/content.md',
                    metaPath: '/content/2000-1-1-12-00/meta.json',
                    date: new Date(2000, 0, 1, 12, 0),
                    longTitle: 'Some test 1',
                    shortTitle: 'test1',
                    slug: 'Some-test-1',
                    tags: [
                        { name: 'Tag 1', slug: 'Tag-1' },
                        { name: 'Tag 2', slug: 'Tag-2' }
                    ]
                }, {
                    id: '2000-1-1-12-15',
                    entryPath: '/content',
                    contentPath: '/content/2001-1-1-12-15/content.md',
                    metaPath: '/content/2001-1-1-12-15/meta.json',
                    date: new Date(2000, 0, 1, 12, 15),
                    longTitle: 'Some test 2',
                    shortTitle: 'test2',
                    slug: 'Some-test-2',
                    tags: [
                        { name: 'Tag 1', slug: 'Tag-1' }
                    ]
                }]);
            }
        },
        fsStub = {
            readFile: function (path, callback) {
                callback(null, "file content");
            }
        },
        bloggyEngine = proxyquire('../lib/bloggy', {
            './metadata': metadataStub,
            './BlogEntry': proxyquire('../lib/BlogEntry', {
                fs: fsStub
            })
        }),
        bloggy;

    beforeEach(function (done) {
        bloggy = bloggyEngine();

        bloggy.setup({
            baseDirectory: '/some/path',
            entryUrl: 'http://test.com/{slug}'
        });

        bloggy.load(function () {
            done();
        });
    });

    describe('load()', function () {
        it('should exist', function () {
            should.exist(bloggy.load);
        });
    });

    describe('extendWith()', function () {
        it('should exist', function () {
            should.exist(bloggy.extendWith);
        });

        it('should register a plugin and initialize it with itself', function (done) {
            var plugin = {
                init: function (engine) {
                    bloggy.should.equal(bloggy);
                    done();
                }
            };

            bloggy.extendWith(plugin);
        });
    });

    describe('loadContent()', function () {
        it('should throw an error when it is not overidden by a plugin', function () {
            bloggy.loadContent.should.throw('Load a parser like bloggy-marked first!');
        });
    });

    describe('loadEntries()', function () {
        it('should load each given entry', function (done) {
            var Entry = function () {
                    var self = this;

                    this.contentWasLoaded = false;
                    this.load = function (callback) {
                        self.contentWasLoaded = true;
                        callback(self, '');
                    };
                },
                entries = [ new Entry(), new Entry(), new Entry()];

            bloggy.loadEntries(entries, function () {
                entries[0].contentWasLoaded.should.equal(true);
                entries[1].contentWasLoaded.should.equal(true);
                entries[2].contentWasLoaded.should.equal(true);

                done();
            });
        });
    });

    describe('getAllEntries()', function () {
        it('should return all loaded entries', function () {
            var result = bloggy.getAllEntries();

            result.length.should.eql(2);
            result[0].id.should.eql('2000-1-1-12-00');
            result[1].id.should.eql('2000-1-1-12-15');
        });
    });
});