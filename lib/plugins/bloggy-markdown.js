'use strict';

var marked = require('marked');

marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

module.exports = exports = {
    init : function (engine) {
        engine.loadContent = function (content, callback) {
            exports.parseMarkdownContent(content, engine.getOptions(), callback);
        };
    }
};

exports.parseMarkdownContent = function (markdownContent, options, callback) {
    marked(markdownContent, function (err, content) {
        if (err) { throw err; }
        callback(content);
    });
};