/*global describe, it */
"use strict";

var proxyquire = require('proxyquire'),
    should = require('should');

describe('defaults', function () {
    var defaults = proxyquire('../lib/defaults', {
        marked: function (content, callback) {
            callback(null, '<html></html>');
        },
        rss: function (options) {
            this.item = function (item) { return; };
            this.xml = function (separator) { return '<feed></feed>'; };
        }
    });

    describe('generateFeedXml()', function () {
        it('uses the rss modulte to generate xml content', function () {
            var preset = defaults.preset(),
                result = preset.generateFeedXml(
                    {
                        entries: [{}]
                    },
                    {
                        feed: { },
                        urls: {
                            entry: 'http://test.com/blug/{slug}'
                        }
                    }
                );

            result.should.equal('<feed></feed>');
        });
    });

    describe('parseMarkdownContent()', function () {
        it('uses the marked module to generate markedown content', function (done) {
            var preset = defaults.preset();

            preset.parseMarkdownContent('markdownContent', { }, function (result) {
                result.should.equal('<html></html>');
                done();
            });
        });
    });
});