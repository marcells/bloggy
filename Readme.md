Bloggy
======

Small and lightweight markdown blog engine for node.js.

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

```
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

```
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