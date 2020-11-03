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

// Code des régions
var input = [{key:28, lat:"49.524641", lng:"0.882833"},{key:94, lat:"42.039604", lng:"9.012893"},{key:93, lat:"44.9351691", lng:"6.0679194"},{key:84, lat:"45.1695797", lng:"5.4502821"},{key:76, lat:"43.5912356", lng:"3.2583626"},{key:75, lat:"47.7632836", lng:"-0.3299687"},{key:53, lat:"48.2020471", lng:"-2.9326435"},{key:52, lat:"44.7002222", lng:"-0.2995785"},{key:24, lat:"47.7515", lng:"1.675"},{key:11, lat:"48.8499198", lng:"2.6370411"},{key:32, lat:"50.5732769", lng:"2.3244679"},{key:27, lat:"47.1343207", lng:"6.0223016"}];



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

function mergeData(arr1, arr1key, arr2, arr2key) {
    
    let merged = [];

    for(let i=0; i<arr1.length; i++) {
    merged.push({
    ...arr1[i], 
    ...(arr2.find((truc) => truc[arr2key] === arr1[i][arr1key]))}
    );
    }

    return merged;
}

function mergeDataNoJointure(arr1, arr2) {
    
    let merged = [];
    for(let i=0; i<arr1.length; i++) {
        merged.push({
        ...arr1[i],
        ...arr2
        });
    }

    return merged;
}


app.get("/trends", cors(corsOptions), async function(req, res){

    // On récupère régions
    var regions = getRegions();

    // On récupère le film demandé
    var movie = req.param("title"); 
    console.log(movie)

    // On récupère les données du film demandé
    var films;
    var url = "https://api.betaseries.com/movies/search?key=c3796994ef78&title=" + movie;
    await fetch(url)
        .then(res => res.json())
        .then(json => {
            films = json;
        })

    // On récupère les données météo
    var result = '';
    var meteo = new Array();
    for(var i = 0; i < input.length; i++){
        var lat = input[i].lat;
        var lng = input[i].lng;
        var key = input[i].key;
        await fetch('https://www.prevision-meteo.ch/services/json/lat='+lat+'lng='+lng)
        .then(function(response) {
            response.json()
            .then(function(data) {
                result=data;
                result.code=key;
                meteo.push(result);
            })
        })    
    }


    // On récupère les données google trends
    // Et on fait notre fusion de données avec ces données
    googleTrends.interestByRegion({
        keyword: movie,
        geo: "FR",
        resolution: "REGION"
    })
    .then(res => JSON.parse(res))
    .then(json => {
        //console.log(result);

        // Ok pour trends
        var trends = json['default']['geoMapData']

        // On jointe les deux sur Libelle == geoName
        var merged = mergeData(regions, 'Libelle', trends, 'geoName')

        // On joint merged avec film
        var merged2 = mergeDataNoJointure(merged, films);

        // On jointe les deux merged sur code == Code
        var merged3 = mergeData(merged2, "Code", meteo, "code");

        // On le renvoie
        res.format({
            /*'text/html': function () {
                console.log(merged3)
                res.send("data fetched look your console");
            },*/
            'application/json': function () {
                res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                res.set('Content-Type', 'application/json');
                res.json(merged3);
            }
        })
    })
})


app.listen(port, function () {
    console.log('Serveur listening on port ' + port);
});