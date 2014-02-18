/*global describe, it */
"use strict";

var should = require('should');

describe('metadata', function () {
    var metadata = require('../lib/metadata');

    describe('load()', function () {
        it('should exist', function () {
            should.exist(metadata.load);
        });
    });
});