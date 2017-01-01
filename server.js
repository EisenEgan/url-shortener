var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/urlservice';
var db;

// Use connect method to connect to the server
mongo.connect(url, function(err, database) {
    if(err) throw err;
    db = database;
    app.listen(8080, function() {
        console.log("App listening on port 8080.");
    });
});

app.get('/new/:url*', function(req, res) {
    var urlInTheParam = req.params['url'] + req.params[0];
    var short_url, newid;
    if (urlInTheParam.match(/https*:\/\/www\..+\.com/)) {
        var numItems = db.collection('urlservice').count();
        numItems.then(function (value) {
            if (value == 0)
                newid = 1000;
            else
                newid = 1000 + value;
            short_url = "https://short-url-eisenegan.c9users.io/" + newid;
            db.collection('urlservice').save({_id: newid, original_url: urlInTheParam, short_url: short_url}, (err, result) => {
                if (err) throw err;
                    res.json({original_url: urlInTheParam, short_url: short_url});
            });
        });
    }
    else {
        res.write("<p>A URL was not provided.</p>");
        res.end();
    }
});

app.get('/:num', function(req, res) {
    var link = db.collection('urlservice').findOne({ _id: parseInt(req.params.num) });
    link.then(function (value) {
        if (value != null) {
            res.redirect(value.original_url);
        }
        else {
            res.write("<p>A created short URL was not provided.</p>");
            res.end();
        }
    })
});