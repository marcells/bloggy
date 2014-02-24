[![Build Status](https://travis-ci.org/marcells/bloggy.png?branch=master)](https://travis-ci.org/marcells/bloggy)
[![Coverage Status](https://coveralls.io/repos/marcells/bloggy/badge.png?branch=master)](https://coveralls.io/r/marcells/bloggy?branch=master)
[![Dependency Status](https://david-dm.org/marcells/bloggy.png?theme=shields.io)](https://david-dm.org/marcells/bloggy)
[![devDependency Status](https://david-dm.org/marcells/bloggy/dev-status.png?theme=shields.io)](https://david-dm.org/marcells/bloggy#info=devDependencies)
[![npm module](https://badge.fury.io/js/bloggy.png)](http://badge.fury.io/js/bloggy)

Bloggy
======

Small and lightweight markdown blog engine for node.js.

The code is checked with jslint and tested with mocha. You can use the grunt task to generate the code coverage. Just enter `grunt` at the command prompt.

**Currently the documentation is incomplete!**

Folder structure
----------------

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

Metadata (meta.json)
--------------------

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

Setup
-----

```Javascript
var path = require('path'),
    bloggy = require('bloggy'),
    engine = bloggy();

...

engine.setup({
    baseDirectory: path.join(__dirname, 'content'),
    urls: {
        base: 'http://mspi.es',
        feed: 'http://mspi.es/feed',
        favicon: 'http://mspi.es/favicon.ico',
        entry: 'http://mspi.es/blog/{slug}',
        images: 'http://mspi.es/images/blog/{imageUrl}'
    },
    feed: {
        author: 'Marcell Spies',
        title: 'Marcell Spies - Developers Diary',
        description: 'some description',
        copyright: '© Marcell Spies',
        language: 'de',
        ttl: 30
    }
});

...

engine.load(function () {
    // The engine is ready now
    // Run your web framework or do other stuff with it
});

```

Blog entry
----------

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

Engine functions
----------------

The engine contains the following functions.


**Get all blog entries (ordered by name)**

```Javascript
var entries = engine.entries.all.orderedByName();
```

**Get all blog entries (ordered by date [descending])**

```Javascript
var entries = engine.entries.all.orderedByDate();
```

**Get entries containing a specific tag slug**

```Javascript
var entries = engine.entries.byTagSlug('Continuous-Integration');
```

**Get one entry by its slug**

```Javascript
var entry = engine.entry.bySlug('How-to-deploy-to-Travis-CI');
```

**Get one entry by its short title**

```Javascript
var entry = engine.entry.byShortTitle('travisdeploy');
```

**Get the latest/newest entry**

```Javascript
var entry = engine.entry.latest();
```

**Get all tags (ordered by the number of usages)**

```Javascript
var tags = engine.tags.all();

[
    { count: 5, tag: { name: 'tech', slug: 'tech'} },
    { count: 4, tag: { name: 'nodejs', slug: 'nodejs'} },
    { count: 1, tag: { name: 'Continuous Integration', slug: 'Continuous-Integration'} },
]
```

**Get all tags names**

```Javascript
var tagNames = engine.tags.asNames();

['tech', 'nodejs', 'Continuous Integration']
```

**Load the content of multiple entries**

After executing, you have access to the content property of each entry.

```Javascript
engine.entries.load(entries, function() {
    entries.forEach(function (entry) {
        var content = entry.content;
    });
});
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