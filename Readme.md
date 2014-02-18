Bloggy
======

Small and lightweight markdown blog engine for node.js.

** Currently the documentation is incomplete! **

Folder structure
----------------

The blog content has to use the following folder structure.

- content
    - 2013-11-21-18-30
        - meta.json
        - content.md
    - 2013-12-8-9-45
        - meta.json
        - content.json
    - ...

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

Code
----

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