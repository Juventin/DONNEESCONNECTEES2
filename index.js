'use strict'

import { cleanData, mergeData, mergeDataNoJointure, createRDFXML } from './functions.js';
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
var corsOrigins = '*'

app.use(cors({origin: corsOrigins}));


app.get("/", function(req, res){
    res.send("Retrouvez la documentation sur le lien suivant : https://github.com/Juventin/DONNEESCONNECTEES2");
})


function getRegions() {

    let filePath = path.join('files', 'regions.json');

    let rawdata = fs.readFileSync(filePath);
    let data = JSON.parse(rawdata);

    return data
}

app.get("/vocabulary", function(req, res){
    res.setHeader('Access-Control-Allow-Origin', corsOrigins);

    let filePath = path.join('files', 'rdfvocabulary.xml');

    fs.readFile(filePath, 'utf8', function (err,data) {

        // On remplace PROTOCOLVAR par le chemin du client
        var xml = data.replace(':PROTOCOLVAR:', req.protocol+"://"+req.headers.host);
      
        res.setHeader('Content-disposition', 'attachment; filename=rdfvocabulary.xml');
        res.set('Content-Type', 'application/xml');
        res.send(xml);
      });

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
                res.setHeader('Content-disposition', 'attachment; filename=trends.json');
                res.set('Content-Type', 'application/json');
                res.json(merged3);
            },
            'application/rdf+xml': function () {
                res.setHeader('Content-disposition', 'attachment; filename=trends.xml');
                res.set('Content-Type', 'application/xml');
                res.send(toXML(merged3));
            }
        })
    })
})


app.get("/trendsXML/:movie/:region", async function (req, res) {
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

        // On le renvoie
        res.setHeader('Content-disposition', 'attachment; filename=trends.xml');
        res.set('Content-Type', 'application/xml');
        res.send(createRDFXML(merged3, 'trends', movie));
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

        res.format({
            'application/json': function () {
                res.setHeader('Content-disposition', 'attachment; filename=movie.json');
                res.set('Content-Type', 'application/json');
                res.json(cleanData(films['movies'], 'films', movie));
            },
            'application/rdf+xml': function () {
                res.setHeader('Content-disposition', 'attachment; filename=movie.xml');
                res.set('Content-Type', 'application/xml');
                res.send(createRDFXML(films['movies'], 'films', movie));
            }
        })
    })
})

app.get("/movieXML/:movie", async function (req, res) {
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
        
        res.setHeader('Content-disposition', 'attachment; filename=movie.xml');
        res.set('Content-Type', 'application/xml');
        res.send(createRDFXML(films['movies'], 'films', movie));
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

        // On le renvoie
        res.format({
            'application/json': function () {
                res.setHeader('Content-disposition', 'attachment; filename=region.json');
                res.set('Content-Type', 'application/json');
                res.json(cleanData(merged, 'region'));
            },
            'application/rdf+xml': function () {
                res.setHeader('Content-disposition', 'attachment; filename=region.xml');
                res.set('Content-Type', 'application/xml');
                res.send(createRDFXML(merged, 'region'));
            }
        })

    })
})


app.get("/regionXML/:region", async function (req, res) {
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

/////////////////////// On récupère les données météo
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

            // On le renvoie
            res.setHeader('Content-disposition', 'attachment; filename=region.xml');
            res.set('Content-Type', 'application/xml');
            res.send(createRDFXML(merged, "region"));

        })
})



app.listen(port, function () {
    console.log('Serveur listening on port ' + port);
});
