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

function getRegions() {

    let filePath = path.join('files', 'chomage.json');

    let rawdata = fs.readFileSync(filePath);
    let data = JSON.parse(rawdata);

    return data
}

function mergeData(arr1, arr2) {

    console.log('on y rentre')
    
    
    let merged = [];

    for(let i=0; i<arr1.length; i++) {
    merged.push({
    ...arr1[i], 
    ...(arr2.find((truc) => truc.geoName === arr1[i].Libelle))}
    );
    }

    return merged;
    
}

app.get("/trends", function(req, res){

    // On récupère régions
    var regions = getRegions();

    // On récupère le film demandé
    var movie = req.param("title"); 
    console.log(movie)

    // On récupère les données google trends
    googleTrends.interestByRegion({
        keyword: movie,
        geo: "FR",
        resolution: "REGION"
    })
    .then(res => JSON.parse(res))
    .then(json => {
        // Ok pour trends
        var trends = json['default']['geoMapData']

        var merged = mergeData(regions, trends)

        res.send(merged)
    })
})


app.listen(port, function () {
    console.log('Serveur listening on port ' + port);
});