'use strict'

import { cleanData } from './cleanData.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

var express = require('express');
var app = express();

const port = process.env.PORT || 3000;

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

    let filePath = path.join('files', 'regions.json');

    let rawdata = fs.readFileSync(filePath);
    let data = JSON.parse(rawdata);

    return data
}

function mergeData(arr1, arr1key, arr2, arr2key) {

    let merged = [];

    for (let i = 0; i < arr1.length; i++) {
        merged.push({
            ...arr1[i],
                ...(arr2.find((truc) => truc[arr2key] === arr1[i][arr1key]))
        });
    }

    return merged;
}

function mergeDataNoJointure(arr1, arr2) {

    let merged = [];
    for (let i = 0; i < arr1.length; i++) {
        merged.push({
            ...arr1[i],
                ...arr2
        });
    }

    return merged;
}


app.get("/trends", cors(corsOptions), async function (req, res) {

    // On récupère régions
    var regions = getRegions();

    // On récupère le film demandé
    var movie = req.param("title");
    console.log(movie)

    // On récupère les données du film demandé
    var films;
    var url = "https://api.betaseries.com/movies/search?key=c3796994ef78&title=" + movie;


    await fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(json => {
            films = json;
        })


    // On récupère les données météo
    var result = '';
    var meteo = new Array();
    for (var i = 0; i < regions.length; i++) {
        var lat = regions[i].lat;
        var lng = regions[i].lng;
        var key = regions[i].Code;
        await fetch('https://www.prevision-meteo.ch/services/json/lat=' + lat + 'lng=' + lng, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                response.json()
                    .then(function (data) {
                        result = data;
                        result.code = key;
                        meteo.push(result);
                    })
            })
    }

    var yesterday = new Date(new Date().setDate(new Date().getDate() - 3))

    // On récupère les données google trends
    // Et on fait notre fusion de données avec ces données
    googleTrends.interestByRegion({
            keyword: movie,
            geo: "FR",
            resolution: "REGION",
            startTime: yesterday
        })
        .then(res => JSON.parse(res))
        .then(json => {
            //console.log(result);

            // Ok pour trends
            var trends = json['default']['geoMapData'];

            // On jointe les deux sur Libelle == geoName
            var merged = mergeData(regions, 'Libelle', trends, 'geoName');

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


app.get("/movies", cors(corsOptions), async function (req, res) {

    var movie = req.param("title");
    // On récupère les données du film demandé
    var films;
    var url = "https://api.betaseries.com/movies/search?key=c3796994ef78&title=" + movie;


    await fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(json => {
            films = json;
            res.format({
                /*'text/html': function () {
                    console.log(merged3)
                    res.send("data fetched look your console");
                },*/
                'application/json': function () {
                    res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                    res.set('Content-Type', 'application/json');
                    res.json(films);
                }
            })
        })



})

app.get("/region", cors(corsOptions), async function (req, res) {

    // On récupère régions
    var regions = getRegions();

    // On récupère le film demandé
    var region = req.param("title");

    function checkRegion(regioncheck) {
        return regioncheck.Libelle = region;
    }
    var indexRegion = regions.findIndex(checkRegion)


    // On récupère les données météo
    var result = '';
    var meteo = new Array();
    var lat = regions[indexRegion].lat;
    var lng = regions[indexRegion].lng;
    var key = regions[indexRegion].Code;
    await fetch('https://www.prevision-meteo.ch/services/json/lat=' + lat + 'lng=' + lng, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(json => {
            var meteo = json;


            // On jointe les deux merged sur code == Code
            var merged = mergeData(regions, "Code", meteo, "code");
            merged = cleanData(merged, 'region')

            // On le renvoie
            res.format({
                /*'text/html': function () {
                    console.log(merged3)
                    res.send("data fetched look your console");
                },*/
                'application/json': function () {
                    res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                    res.set('Content-Type', 'application/json');
                    res.json(merged);
                }
            })

        })
})
app.listen(port, function () {
    console.log('Serveur listening on port ' + port);
});
