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
                    id: '2000-1-1-12-15',
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
});