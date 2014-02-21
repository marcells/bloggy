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
                    slug: 'Some-test-2',
                    tags: [
                        { name: 'Tag 1', slug: 'Tag-1' }
                    ]
                }]);
            }
        },
        bloggyEngine = proxyquire('../lib/bloggy', {
            './metadata': metadataStub
        }),
        bloggy;

    beforeEach(function (done) {
        bloggy = bloggyEngine();

        bloggy.setup({
            baseDirectory: '/some/path'
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

    describe('entries.all.orderedByName()', function () {
        it('should return the loaded entries ordered by their name', function () {
            var result = bloggy.entries.all.orderedByName();

            result.length.should.eql(2);
            result[0].id.should.eql('2000-1-1-12-00');
            result[1].id.should.eql('2000-1-1-12-15');
        });
    });

    describe('entries.all.orderedByDate()', function () {
        it('should return the loaded entries ordered by their date', function () {
            var result = bloggy.entries.all.orderedByDate();

            result.length.should.eql(2);
            result[0].id.should.eql('2000-1-1-12-15');
            result[1].id.should.eql('2000-1-1-12-00');
        });
    });

    describe('entries.byTagSlug()', function () {
        it('should return all loaded entries with a given tag slug', function () {
            var result = bloggy.entries.byTagSlug('Tag-1');

            result.length.should.eql(2);
            result[0].id.should.eql('2000-1-1-12-00');
            result[1].id.should.eql('2000-1-1-12-15');
        });
    });

    describe('tags.all()', function () {
        it('should return all tags with the number of usages ordered by this number', function () {
            var result = bloggy.tags.all();

            result.should.eql([
                {
                    tag: { name: 'Tag 1', slug: 'Tag-1' },
                    count: 2
                },
                {
                    tag: { name: 'Tag 2', slug: 'Tag-2' },
                    count: 1
                }]);
        });
    });

    describe('tags.asNames()', function () {
        it('should return all tag names as an array', function () {
            var result = bloggy.tags.asNames();

            result.should.eql(['Tag 1', 'Tag 2']);
        });
    });
});