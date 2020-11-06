'use strict'

import { cleanData } from './cleanData.js';
import { createRequire } from 'module';
import pkg from 'jstoxml';
const { toXML } = pkg;
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
var corsOrigins = [
    // 'https://juventin.github.io/DONNEESCONNECTEES2/', // PROD
    '*' // DEV
]



app.get("/", function(req, res){
    res.send("Retrouvez la documentation sur le lien suivant : https://github.com/Juventin/DONNEESCONNECTEES2");
})


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

app.get("/vocabulary", function(req, res){
    res.setHeader('Access-Control-Allow-Origin', corsOrigins);

    let filePath = path.join('files', 'rdfvocabulary.xml');

    let xml = fs.readFileSync(filePath);

    res.setHeader('Content-disposition', 'attachment; filename=rdfvocabulary.xml'); //do nothing
    res.set('Content-Type', 'application/xml');
    res.send(xml);
})

app.get("/trends/:movie/:region", async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', corsOrigins);

    // On récupère régions
    var regions = getRegions();

    // On récupère le film demandé
    var movie = decodeURI(req.params.movie);
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


    // On récupère le film demandé
    var region = decodeURI(req.params.region.toLowerCase());
    function checkRegion(regioncheck) {
        return regioncheck.Libellelow == region;
    }
    var indexRegion = regions.findIndex(checkRegion);
    console.log(indexRegion);


    // On récupère les données météo
    var result = '';
    var meteo_arr = new Array();
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
            meteo.code = key;
            meteo_arr.push(meteo);
        })

    var yesterday = new Date(new Date().setDate(new Date().getDate() - 10))

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

            // On jointe les deux merged sur code == Code
            var merged = mergeData(meteo_arr, "code", regions, "Code");
            merged = cleanData(merged, 'region')
            
            // On jointe les deux sur Libelle == geoName
            var merged2 = mergeData(merged, 'Region', trends, 'geoName');
            // On joint merged avec film
            var merged3 = mergeDataNoJointure(films.movies, merged2);
            merged3 = cleanData(merged3, 'trends', movie)

            // On le renvoie
            res.format({
                'application/json': function () {
                    res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                    res.set('Content-Type', 'application/json');
                    res.json(merged3);
                },
                'application/rdf+xml': function () {
                    res.setHeader('Content-disposition', 'attachment; filename=score.xml'); //do nothing
                    res.set('Content-Type', 'application/xml');
                    res.send(toXML(merged3));
                }
            })
        })

})


app.get("/movie/:movie", async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', corsOrigins);

    var movie = decodeURI(req.params.movie);
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
            films = cleanData(films['movies'], 'films', movie)
            console.log(films)

            res.format({
                'application/json': function () {
                    res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                    res.set('Content-Type', 'application/json');
                    res.json(films);
                },
                'application/rdf+xml': function () {
                    res.setHeader('Content-disposition', 'attachment; filename=score.xml'); //do nothing
                    res.set('Content-Type', 'application/xml');
                    res.send(toXML(films));
                }
            })
        })



})

app.get("/region/:region", async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', corsOrigins);

    // On récupère régions
    var regions = getRegions();

    // On récupère le film demandé
    var region = decodeURI(req.params.region.toLowerCase());

    function checkRegion(regioncheck) {
        return regioncheck.Libellelow == region;
    }
    var indexRegion = regions.findIndex(checkRegion);
    console.log(indexRegion);


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
            var meteo_arr = new Array();
            meteo.code = key;
            meteo_arr.push(meteo);


            // On jointe les deux merged sur code == Code
            var merged = mergeData(meteo_arr, "code",regions, "Code");
            merged = cleanData(merged, 'region')

            // On le renvoie
            res.format({
                'application/json': function () {
                    res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                    res.set('Content-Type', 'application/json');
                    res.json(merged);
                },
                'application/rdf+xml': function () {
                    res.setHeader('Content-disposition', 'attachment; filename=score.xml'); //do nothing
                    res.set('Content-Type', 'application/xml');
                    res.send(toXML(merged));
                }
            })

        })
})

app.use(cors({origin: corsOrigins}));


app.listen(port, function () {
    console.log('Serveur listening on port ' + port);
});
