/*global describe, it */
"use strict";

var proxyquire = require('proxyquire'),
    should = require('should');

describe('defaults', function () {
    var defaults = proxyquire('../lib/defaults', {
        marked: function (content, callback) {
            callback(null, '<html></html>');
        }
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