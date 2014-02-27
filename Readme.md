[![Build Status](https://travis-ci.org/marcells/bloggy.png?branch=master)](https://travis-ci.org/marcells/bloggy)
[![Coverage Status](https://coveralls.io/repos/marcells/bloggy/badge.png?branch=master)](https://coveralls.io/r/marcells/bloggy?branch=master)
[![Dependency Status](https://david-dm.org/marcells/bloggy.png?theme=shields.io)](https://david-dm.org/marcells/bloggy)
[![devDependency Status](https://david-dm.org/marcells/bloggy/dev-status.png?theme=shields.io)](https://david-dm.org/marcells/bloggy#info=devDependencies)
[![npm module](https://badge.fury.io/js/bloggy.png)](http://badge.fury.io/js/bloggy)

# bloggy

> Small and lightweight blog engine for node.js.

The code is checked with jslint and tested with mocha. You can use the grunt task to generate the code coverage. Just enter `grunt` at the command prompt.

**Currently the documentation is incomplete!**

## Folder structure

The blog content has to use the following folder structure.

- content
    - 2013-11-21-18-30
        - meta.json
        - content.md
    - 2013-12-8-9-45
        - meta.json
        - content.md
    - ...

The folder names below the main "content" folder are used as identifier and publishing date of the article. Use the format "year-month-day-hour-minute".

### Metadata (meta.json)

```JSON
{
    "longTitle": "Title of the blog entry",
    "shortTitle": "entry1",
    "tags": ["tech", "node", "markdown"]
}
```

- The longTitle and shortTitle has to be unique.
- The shortTitle can be used for a url shortener like functionality.
- The tags are case sensitive.

### Blog entry content (content.md)

This is the markdown file with the blog entry content, which will be rendered to HTML by using a bloggy renderer plugin (e.g. http://github.com/marcells/bloggy-marked).

## Quickstart

### 1. Install it
```Bash
$ npm install bloggy
```

### 2. Configure it
```Javascript
var path = require('path'),
    bloggy = require('bloggy'),
    engine = bloggy();

// You may extend bloggy with some plugins (see 'Plugins' below)
engine.extendWith(require('bloggy-some-plugin'));

// Setup the path to the blog content and the unique url to each entry
engine.setup({
    baseDirectory: path.join(__dirname, 'content'),
    entryUrl: 'http://mspi.es/blog/{slug}'
});

```

### 3. Run it
```Javascript
// Load all blog metadata in the content folder defined in the baseDirectory option
engine.load(function () {
    // The engine is ready now
    // Run your web framework or do other stuff with it
});
```

## Plugins

Bloggy gets its power from plugins. Feel free to create some by yourself. If you need a template, just take a look at the currently existing ones.

| Plugin (NPM)  | Repository                               |
|---------------| -----------------------------------------|
| bloggy-query  | http://github.com/marcells/bloggy-query  |
| bloggy-marked | http://github.com/marcells/bloggy-marked |
| bloggy-rss    | http://github.com/marcells/bloggy-rss    |

## Blog entry

The structure of a blog entry:

```Javascript
{
    id: '2014-10-04-20-30',
    entryPath: '/var/www/myblog/content/2014-10-04-20-30',
    contentPath: '/var/www/myblog/content/2014-10-04-20-30/content.md',
    metaPath: '/var/www/myblog/content/2014-10-04-20-30/meta.json',
    shortTitle: 'travisdeploy',
    longTitle: 'How to deploy to Travis-CI',
    url: 'http://mspi.es/blog/How-to-deploy-to-Travis-CI',
    date: new Date(2014, 09, 04, 20, 30),
    slug: 'How-to-deploy-to-Travis-CI',
    tags: [ 
        { name: 'tech', slug: 'tech'}, 
        { name: 'Continiuous Integration', slug: 'Continuous-Integration'}]
    content: '<h2>...</h2>' /* content is only available, when you have loaded it */
}
```

Every entry contains a `load()` method with callback, which is called after its content has been loaded. This content is cached as long as you hold a reference to this blog entry object.

```Javascript
entry.load(function () {
    var content = entry.content;
});
```

## Engine functions

The engine contains the following functions.

**Load the content of multiple entries**

After executing, you have access to the content property of each entry.

```Javascript
engine.entries.load(entries, function() {
    entries.forEach(function (entry) {
        var content = entry.content;
    });
});
```

**Extend the engine with additional functionality**

Add plugins to the bloggy engine. The plugins could be configured. Please check the documentation in the several repos.

```Javascript
engine.extendWith(require('bloggy-query'));
engine.extendWith(require('bloggy-marked'));
engine.extendWith(require('bloggy-rss'));
```

License
-------

The MIT License (MIT)

Copyright (c) 2014 Marcell Spies

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.