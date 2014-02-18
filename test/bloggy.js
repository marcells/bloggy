/*global describe, it */
"use strict";

var should = require('should');

describe('bloggy', function () {
    var bloggy = require('../lib/bloggy')();

    describe('load()', function () {
        it('should exist', function () {
            should.exist(bloggy.load);
        });
    });
});