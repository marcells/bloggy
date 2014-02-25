/*jslint node: true */
'use strict';

var marked = require('marked');

marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

var parseMarkdownContent = function (markdownContent, options, callback) {
    marked(markdownContent, function (err, content) {
        if (err) { throw err; }
        callback(content);
    });
};

exports.preset = function () {
    return {
        parseMarkdownContent: parseMarkdownContent
    };
};