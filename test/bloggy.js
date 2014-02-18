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
                    tags: []
                }, {
                    id: '2001-1-1-12-15',
                    entryPath: '/content',
                    contentPath: '/content/2001-1-1-12-15/content.md',
                    metaPath: '/content/2001-1-1-12-15/meta.json',
                    date: new Date(2000, 0, 1, 12, 15),
                    longTitle: 'Some test 2',
                    slug: 'Some-test-2',
                    tags: []
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
        it.skip('should return the loaded entries ordered by their name', function () {
            bloggy.entries.all.orderedByName().length.should.eql(2);
            bloggy.entries.all.orderedByName().should.eql([]);
        });
    });

    describe('entries.all.orderedByDate()', function () {
        it.skip('should return the loaded entries ordered by their date', function () {
            bloggy.entries.all.orderedByDate().length.should.eql(2);
            bloggy.entries.all.orderedByDate().should.eql([]);
        });
    });
});