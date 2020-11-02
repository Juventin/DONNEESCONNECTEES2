'use strict'

var express = require('express');
var app = express();

const port = process.env.PORT || 3000 ;

var fetch = require('node-fetch');
var https = require('https');
const googleTrends = require('google-trends-api');




//serves static files
app.use(express.static('docs'));




app.get("/", function(req, res){
    res.send("helloWorld !");
})

app.get("/:name", function(req, res){
    res.send("hello : " + req.params.name );
})

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

app.get("/cocktail/margarita", function(req, res){
    console.log('ok')
    let url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita" ;
    fetch(url)
    .then(res => res.json())
    .then(json => {
        res.send(json);
    });
})

app.get("/requestair/shangai", function(req, res){
    let url = "https://api.waqi.info/feed/shanghai/?token=demo" ;
    https.get(url, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
         });
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log("requestair", JSON.parse(data));
            res.send("data requested look your console");
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
        res.send("nope request didnt work");
    });
})

app.listen(port, function () {
    console.log('Serveur listening on port ' + port);
});