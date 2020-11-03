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

/////////////////////SARAH

Function getInformationsMétéo() {
	//app.get("?", cors(corsOptions), function (req, res) {      à rajouter 
		var input = [{key:28, lat:"49.524641", lng:"0.882833"},{key:94, lat:"42.039604", lng:"9.012893"},{key:93, lat:"44.9351691", lng:"6.0679194"},{key:84, lat:"45.1695797", lng:"5.4502821"},{key:76, lat:"43.5912356", lng:"3.2583626"},{key:75, lat:"47.7632836", lng:"-0.3299687"},{key:53, lat:"48.2020471", lng:"-2.9326435"},{key:52, lat:"44.7002222", lng:"-0.2995785"},{key:24, lat:"47.7515", lng:"1.675"},{key:11, lat:"48.8499198", lng:"2.6370411"},{key:32, lat:"50.5732769", lng:"2.3244679"},{key:27, lat:"47.1343207", lng:"6.0223016"}];

		var result = '';
		var df = new Array;
		for(var i = 0; i < input.length; i++){
		var lat = input[i].lat;
		var lng = input[i].lng;
		var key = input[i].key;
			fetch('https://www.prevision-meteo.ch/services/json/lat='+lat+'lng='+lng)
	  		.then(function(response) {
	   	 	response.json()
				.then(function(data) {
		   	 	result=data;
           	 	result.code=key;
            		df.push(result);
           	 	console.log(df);
            
		})})    
		}
	//})   à rajouter 
}
