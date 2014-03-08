var express = require('express');
var http = require('http');
var path = require('path');
var bloggy = require('../../lib/bloggy')
var app = express();

// Some expressjs stuff
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.errorHandler());

// Create bloggy engine
var engine = bloggy();

// Configure bloggy engine
engine.extendWith(require('bloggy-query'));
engine.extendWith(require('bloggy-marked'));

engine.setup({
    baseDirectory: path.join(__dirname, 'content'),
    entryUrl: 'http://localhost:' + app.get('port') + '/blog/{slug}'
});

app.get('/', function(req, res) {
    var entries = engine.entries.all.orderedByDate();

    res.render('index', {
        title: 'All blog entries',
        entries: entries
    });
});

app.get('/blog/:slug', function(req, res) {
    var entry = engine.entry.bySlug(req.params.slug);

    entry.load(function () {
        res.render('entry', {
            entry: entry
        });
    });
});

engine.load(function() {
    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
});