/*global describe, it */
'use strict';

var proxyquire = require('proxyquire'),
    should = require('should'),
    path = require('path');

describe('metadata', function () {
    var metadata = proxyquire('../lib/metadata', {
        glob: function (path, options, callback) {
            callback(null, ['2014-11-9-17-33/meta.json']);
        },
        fs: {
            readFileSync: function (/*fileName*/) {
                return Buffer.from(
                    JSON.stringify({
                        longTitle: 'Some title',
                        tags: ['Some tag']
                    }),
                    'binary'
                );
            }
        }
    });

    describe('load()', function () {
        it('should exist', function () {
            should.exist(metadata.load);
        });

        it('should parse the id', function (done) {
            metadata.load({baseDirectories: ['/data/content']}, function (meta) {
                meta[0].id.should.equal('2014-11-9-17-33');
                done();
            });
        });

        it('should parse the entryPath', function (done) {
            metadata.load({baseDirectories: ['/data/content']}, function (meta) {
                meta[0].entryPath.should.equal(path.resolve('/data/content/2014-11-9-17-33'));
                done();
            });
        });

        it('should parse the default contentPath', function (done) {
            metadata.load({baseDirectories: ['/data/content']}, function (meta) {
                meta[0].contentPath.should.equal(path.resolve('/data/content/2014-11-9-17-33/content.md'));
                done();
            });
        });

        it('should parse the contentPath with a custom filename', function (done) {
            metadata.load(
                {
                    baseDirectories: ['/data/content'],
                    contentFilename: 'content.html'
                },
                function (meta) {
                    meta[0].contentPath.should.equal(path.resolve('/data/content/2014-11-9-17-33/content.html'));
                    done();
                }
            );
        });

        it('should parse the metaPath', function (done) {
            metadata.load({baseDirectories: ['/data/content']}, function (meta) {
                meta[0].metaPath.should.equal(path.resolve('/data/content/2014-11-9-17-33/meta.json'));
                done();
            });
        });

        it('should parse the date', function (done) {
            metadata.load({baseDirectories: ['/data/content']}, function (meta) {
                meta[0].date.should.eql(new Date(2014, 10, 9, 17, 33));
                done();
            });
        });

        it('should parse the slug', function (done) {
            metadata.load({baseDirectories: ['/data/content']}, function (meta) {
                meta[0].slug.should.equal('Some-title');
                done();
            });
        });

        it('should parse the tags', function (done) {
            metadata.load({baseDirectories: ['/data/content']}, function (meta) {
                meta[0].tags.should.eql([
                    {
                        name: 'Some tag',
                        slug: 'Some-tag'
                    }
                ]);

                done();
            });
        });

        it('should handle multiple content paths', function (done) {
            metadata.load(
                {
                    baseDirectories: [
                        '/data/content',
                        '/data/content2',
                        '/data/content3'
                    ]
                },
                function (meta) {
                    meta.should.have.length(3);
                    done();
                }
            );
        });
    });
});
