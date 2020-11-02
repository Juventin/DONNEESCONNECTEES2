'use strict'

var express = require('express');
var app = express();

const port = process.env.PORT || 3000 ;

var fetch = require('node-fetch');
var https = require('https');
var fs = require("fs");
var csv = require('csv-parser');

const googleTrends = require('google-trends-api');
var allocine = require('allocine-api');

var cors = require('cors');
var corsOptions = {
    origin: [
        'https://netflixbutnochill.herokuapp.com/', 
        'https://juventin.github.io/DONNEESCONNECTEES2/'
    ],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}



//serves static files
app.use(express.static('docs'));


// app.get("/:name", function(req, res){
//     res.send("hello : " + req.params.name );
// })

app.get("/trends/netflix", function(req, res){
    googleTrends.interestByRegion({
        keyword: 'netflix',
        geo: "FR",
        resolution: "REGION"
    })
    .then(function(results){
        res.send(results);
    })
    .catch(function(err){
        res.send('Oh no there was an error', err);
    });
})

app.get("/chomage", cors(corsOptions), function(req, res){
    let url = "http://jeremy.juventin.free.fr/files/chomage.json" ;
    fetch(url)
    .then(res => res.json())
    .then(json => {
        res.send(json);
    });
})


app.listen(port, function () {
    console.log('Serveur listening on port ' + port);
});
