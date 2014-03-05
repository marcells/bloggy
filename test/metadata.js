/*global describe, it */
"use strict";

var proxyquire = require('proxyquire'),
    should = require('should');

describe('metadata', function () {
    var metadata = proxyquire('../lib/metadata', {
        glob: function (path, options, callback) {
            callback(null, [
                '/some/folder/to/the/content/2014-11-9-17-33/metadata.json'
            ]);
        },
        fs: {
            readFileSync: function (fileName) {
                return new Buffer(
                    JSON.stringify({
                        longTitle: 'Some title',
                        tags: [ 'Some tag' ]
                    }),
                    "binary"
                );
            }
        }
    });

    describe('load()', function () {
        it('should exist', function () {
            should.exist(metadata.load);
        });

        it('should parse the id', function (done) {
            metadata.load({}, function (meta) {
                meta[0].id.should.equal('2014-11-9-17-33');
                done();
            });
        });

        it('should parse the entryPath', function (done) {
            var path = require('path');

            metadata.load({}, function (meta) {
                meta[0].entryPath.should.equal(path.resolve('/some/folder/to/the/content/2014-11-9-17-33'));
                done();
            });
        });

        it('should parse the contentPath', function (done) {
            var path = require('path');

            metadata.load({}, function (meta) {
                meta[0].contentPath.should.equal(path.resolve('/some/folder/to/the/content/2014-11-9-17-33/content.md'));
                done();
            });
        });

        it('should parse the contentPath with a custom filename', function (done) {
            var path = require('path');

            metadata.load({ content: 'content.html' }, function (meta) {
                meta[0].contentPath.should.equal(path.resolve('/some/folder/to/the/content/2014-11-9-17-33/content.html'));
                done();
            });
        });

        it('should parse the metaPath', function (done) {
            var path = require('path');

            metadata.load({}, function (meta) {
                meta[0].metaPath.should.equal(path.resolve('/some/folder/to/the/content/2014-11-9-17-33/metadata.json'));
                done();
            });
        });

        it('should parse the date', function (done) {
            metadata.load({}, function (meta) {
                meta[0].date.should.eql(new Date(2014, 10, 9, 17, 33));
                done();
            });
        });

        it('should parse the slug', function (done) {
            metadata.load({}, function (meta) {
                meta[0].slug.should.equal('Some-title');
                done();
            });
        });

        it('should parse the tags', function (done) {
            metadata.load({}, function (meta) {
                meta[0].tags.should.eql([{
                    name: 'Some tag',
                    slug: 'Some-tag'
                }]);
                done();
            });
        });
    });
});