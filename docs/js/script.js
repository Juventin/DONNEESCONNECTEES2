async function launchFetch(){
	let title = "";
	let region = "";
	let searchParams = new URLSearchParams(window.location.search);
	if(searchParams.has('title')==true){
		title = searchParams.get('title');
	}
	if(searchParams.has('region')==true){
		region = searchParams.get('region');
	}

	var result;
	if(title != "" && region == ""){
		console.log("-- fetchMovie");
		await fetchMovie(title);
	}else if(title == "" && region != ""){
		console.log("-- fetchRegion");
		await fetchRegion(region);
	}else if(title != "" && region != ""){
		console.log("-- fetchMovieRegion");
		await fetchMovieRegion(title,region);
	}else{
		console.log("-- no fetch");
	}

}

async function fetchMovie(movie){
	// fetch pour récupérer les infos du film
	var result;
	var url = "https://netflixbutnochill.herokuapp.com/movie/"+movie;
	await fetch(url).then(function(response){
		response.json()
		.then(function(data){
			result = data;
			var tab = "<table class='table table-dark'><thead> <tr> <th scope='col'>#</th> <th scope='col'>Directeur</th> <th scope='col'>Titre</th></tr> </thead><tbody> ";
			for (var i = 0; i < data.Movies.length; i++){
				tab += "<tr> <th scope='row'>"+i+"</th> <td>"+data.Movies[i].director+"</td> <td>"+data.Movies[i].originalTitre+"</td> </tr>";
			}
			document.getElementById("container").innerHTML = tab + "</tbody></table>";
		})
	});
}

async function downloadFetch(){
	let title = "";
	let region = "";
	let searchParams = new URLSearchParams(window.location.search);
	if(searchParams.has('title')==true){
		title = searchParams.get('title');
	}
	if(searchParams.has('region')==true){
		region = searchParams.get('region');
	}
	if(title != "" && region == ""){
		var url = "https://netflixbutnochill.herokuapp.com/movie/"+title;
		var win = window.open(url, '_blank');
	  	win.focus();
	}else if(title == "" && region != ""){
	var url = "https://netflixbutnochill.herokuapp.com/region/"+region;
		var win = window.open(url, '_blank');
	  	win.focus();
	}else if(title != "" && region != ""){
	var url = "https://netflixbutnochill.herokuapp.com/trends/"+title+"/"+region;
		var win = window.open(url, '_blank');
	  	win.focus();
	}else{
		console.log("-- no fetch");
	}
}

async function fetchRegion(region){
	document.getElementById("exportButton").innerHTML = "Exporter en XML";
	var data_trad = [
		['fr-bre', 53], //53
		['fr-pdl', 75], //75
		['fr-pac', 93],//93
		['fr-occ', 76], //76
		['fr-naq', 52], //52
		['fr-bfc', 27], //27
		['fr-cvl', 24], // 24
		['fr-idf', 11], //11
		['fr-hdf', 32],//32
		['fr-ara', 84], //84
		['fr-ges', 44], //44
		['fr-nor', 28] //28
	];
	var data_values = [
		['fr-bre', 0], //53
		['fr-pdl', 0], //75
		['fr-pac', 0],//93
		['fr-occ', 0], //76
		['fr-naq', 0], //52
		['fr-bfc', 0], //27
		['fr-cvl', 0], // 24
		['fr-idf', 0], //11
		['fr-hdf', 0],//32
		['fr-ara', 0], //84
		['fr-ges', 0], //44
		['fr-nor', 0] //28
	];
	// fetch pour récupérer les infos du film
	var result;
	var url = "https://netflixbutnochill.herokuapp.com/region/"+region;
	await fetch(url).then(function(response){
		response.json()
		.then(function(data){
			result = data;
			console.log(result);
			for (var i = 0; i < data_trad.length - 1; i++) {
				if(result[0].cle == data_trad[i][1])
				data_values[i][1] = result[0].tauxChomage.replace(',','.');
			}

			Highcharts.mapChart('container', {
			    chart: {
			        map: 'countries/fr/custom/fr-all-mainland'
			    },

			    title: {
			        text: 'Carte de la France par<br>région'
			    },

			    subtitle: {
			        text: 'Source map: https://netflixbutnochill.herokuapp.com'+'<br>Région: '+result[0].Region+'<br>Température: '+result[0].Meteo.temperature+'°C'
			    },

			    mapNavigation: {
			        enabled: true,
			        buttonOptions: {
			            verticalAlign: 'bottom'
			        }
			    },

			    colorAxis: {
			        min: 0
			    },

			    series: [{
			        data: data_values,
			        name: 'Taux de chomage',
			        states: {
			            hover: {
			                color: '#BADA55'
			            }
			        },
			        dataLabels: {
			            enabled: true,
			            format: '{point.name}'
			        }
			    }]
			});
		})
	});
}

async function fetchMovieRegion(title,region){
	var data_trad = [
		['fr-bre', 53], //53
		['fr-pdl', 75], //75
		['fr-pac', 93],//93
		['fr-occ', 76], //76
		['fr-naq', 52], //52
		['fr-bfc', 27], //27
		['fr-cvl', 24], // 24
		['fr-idf', 11], //11
		['fr-hdf', 32],//32
		['fr-ara', 84], //84
		['fr-ges', 44], //44
		['fr-nor', 28] //28
	];
	var data_values = [
		['fr-bre', 0], //53
		['fr-pdl', 0], //75
		['fr-pac', 0],//93
		['fr-occ', 0], //76
		['fr-naq', 0], //52
		['fr-bfc', 0], //27
		['fr-cvl', 0], // 24
		['fr-idf', 0], //11
		['fr-hdf', 0],//32
		['fr-ara', 0], //84
		['fr-ges', 0], //44
		['fr-nor', 0] //28
	];
	// fetch pour récupérer les infos du film
	var result;
	var url = "https://netflixbutnochill.herokuapp.com/trends/"+title+"/"+region;
	await fetch(url).then(function(response){
		response.json()
		.then(function(data){
			result = data;
			for (var i = 0; i < data_trad.length - 1; i++) {
				if(result.cle == data_trad[i][1])
				data_values[i][1] = result.tauxChomage.replace(',','.');
			}
			console.log(result);
			Highcharts.mapChart('container', {
			    chart: {
			        map: 'countries/fr/custom/fr-all-mainland'
			    },

			    title: {
			        text: 'Carte de la France par<br>région'
			    },

			    subtitle: {
			        text: 'Source map: https://netflixbutnochill.herokuapp.com'+'<br>Mot: '+result.word+'<br>Popularité: '+result.Popularite+'%<br>Région: '+result.Region+'<br>Température: '+result.Meteo.temperature+'°C'
			    },

			    mapNavigation: {
			        enabled: true,
			        buttonOptions: {
			            verticalAlign: 'bottom'
			        }
			    },

			    colorAxis: {
			        min: 0
			    },

			    series: [{
			        data: data_values,
			        name: 'Taux de chomage',
			        states: {
			            hover: {
			                color: '#BADA55'
			            }
			        },
			        dataLabels: {
			            enabled: true,
			            format: '{point.name}'
			        }
			    }]
			});
		})
	});
}