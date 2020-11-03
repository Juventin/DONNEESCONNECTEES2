'use strict'

var express = require('express');
var app = express();

const port = process.env.PORT || 3000 ;

var fetch = require('node-fetch');
var https = require('https');
var fs = require("fs");
var path = require('path');

const googleTrends = require('google-trends-api');

var cors = require('cors');
var corsOptions = {
    origin: [
        'https://netflixbutnochill.herokuapp.com/', 
        'https://juventin.github.io/DONNEESCONNECTEES2/'
    ],
    optionsSuccessStatus: 200
}



//serves static files
app.use(express.static('docs'));


// app.get("/:name", function(req, res){
//     res.send("hello : " + req.params.name );
// })

app.get("/trends", function(req, res){
    var movie = req.param("title"); 
    googleTrends.interestByRegion({
        keyword: movie,
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
   
    filePath = path.join('files', 'chomage.json');

    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            console.log('received data: ' + data);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(data);
            res.end();
        } else {
            console.log(err);
        }
    });
})


app.listen(port, function () {
    console.log('Serveur listening on port ' + port);
});