'use strict'

var express = require('express');
var app = express();

app.use(express.static('docs'));
const port = process.env.PORT || 3000;

var fetch = require('node-fetch');
var https = require('https');
var fs = require("fs");

const googleTrends = require('google-trends-api');
var allocine = require('allocine-api');

app.get("/", function (req, res) {
    res.send("coucou");
})

var cors = require('cors');
var corsOptions = {
    origin: [
        'https://netflixbutnochill.herokuapp.com/',
        'https://juventin.github.io/DONNEESCONNECTEES2/'
    ],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//Gaelle test
/*
function getAllocine(filmName) {
    var result;
    allocine.api('search', {q: filmName, filter: 'movie'}, function(error, results) {
        if(error) { 
            //console.log('Error : '+ error);
            //return;
            res.send('Oh no there was an error', error);
    allocine.api('search', {
        q: filmName,
        filter: 'movie'
    }, function (error, results) {
        if (error) {
            console.log('Error : ' + error);
            return;
        }
        //console.log('Voici les données retournées par l\'API Allociné:');
        //console.log(results);
        res.send(results);
    });


}

app.get("/allocine", function (req, res) {
    getAllocine("spiderman");
});
*/
//source : https://www.npmjs.com/package/allocine-api

app.get("/allocine", function (req, res) {
    allocine.api('search', {
        q: 'spiderman', 
        filter: 'movie'
    })
    .then(function (results) {
        res.send(results);
    })
    .catch(function (err) {
        res.send('Oh no there was an error', err);
    });
})





//fin test gaelle

function getTrendsPerRegion() {
    //serves static files
    app.use(express.static('docs'));


    app.get("/:name", function (req, res) {
        res.send("hello : " + req.params.name);
    })

    app.get("/trends/netflix", function (req, res) {
        googleTrends.interestByRegion({
                keyword: 'netflix',
                geo: "FR",
                resolution: "REGION"
            })
            .then(function (results) {
                res.send(results);
            })
            .catch(function (err) {
                res.send('Oh no there was an error', err);
            });
    })
}

function getInformationsAboutTheCSP() {
    app.get("/cocktail/margarita", function (req, res) {
        console.log('ok')
        let url = "https://www.insee.fr/fr/statistiques/fichier/2012804/sl_etc_2020T2.xls";
        console.log('on y va')
        fetch(url)
            .then(res => res.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(data => console.log(data))
    })
}

function getInformationsAboutTheMovie(movieName, app) {
    app.get("/movie/informations", cors(corsOptions), function (req, res) {
        var url = "https://api.betaseries.com/movies/search?key=c3796994ef78&title=" + movieName;
        fetch(url)
            .then(res => res.json())
            .then(json => {
                console.log("fetchair", json);

                res.format({
                    'text/html': function () {
                        res.send("data fetched look your console");
                    },
                    'application/json': function () {
                        res.setHeader('Content-disposition', 'attachment; filename=score.json'); //do nothing
                        res.set('Content-Type', 'application/json');
                        res.json(json);
                    }
                })
            })
    })
}

getInformationsAboutTheMovie("Avatar", app)

app.listen(port, function () {
    console.log('Serveur listening on port ' + port);
});
