function cleanData(data, type, word=false) {
    console.log('Cleaning')
    let data2 = []

    if (type == 'trend') {
        for (let i = 0; i < data.length; i++) {
            let row = {}
            row.popularite = data[i]['value'][0]
            row.nomRegion = data[i]['geoName']
            data2.push(row);
        }
    }

    if (type == 'region') {
        for (let i = 0; i < data.length; i++) {
            let row = {}
            row.cle = data[i]['Code']
            row.Region = data[i]['Libelle']
            try {
                row.tauxChomage = data[i]['T2_2020']
                row.Meteo = {}
                row.Meteo.date = data[i]['current_condition']['date']
                row.Meteo.hour = data[i]['current_condition']['hour']
                row.Meteo.temperature = data[i]['current_condition']['tmp']
                row.Meteo.vitesseDuVent = data[i]['current_condition']['wnd_spd']
                row.Meteo.directionDuVent = data[i]['current_condition']['wnd_dir']
                row.Meteo.pression = data[i]['current_condition']['pressure']
                row.Meteo.humidite = data[i]['current_condition']['humidity']
                row.Meteo.conditionClimatique = data[i]['current_condition']['condition']
            } catch (e) {}
            data2.push(row);
        }
    }

    if (type == 'films') {
        data2 = {}
        data2.word = word
        data2.Movies = []
        for (let i = 0; i < data.length; i++) {
            let row = {}
            row.titre = data[i]['title']
            row.originalTitre = data[i]['original_title']
            row.productionYear = data[i]['production_year']
            row.releaseDate = data[i]['original_release_date']
            row.director = data[i]['director']
            row.length = data[i]['length']
            row.genres = data[i]['genres']
            row.originalLanguage = data[i]['language']
            data2.Movies.push(row);
        }
    }

    if (type == 'trends') {
        data2 = data[0][0]
        data2.word = word
        data2.Popularite = data2.value[0]
        delete data2['value']
        delete data2['geoCode']
        delete data2['geoName']
        delete data2['formattedValue']
        delete data2['maxValueIndex']
        delete data2['hasData']
        data2.Movies = []
        for (let i = 0; i < data.length; i++) {
            let row = {}
            row.title = data[i]['title']
            row.originalTitle = data[i]['original_title']
            row.productionYear = data[i]['production_year']
            row.releaseDate = data[i]['original_release_date']
            row.director = data[i]['director']
            row.length = data[i]['length']
            row.genres = data[i]['genres']
            row.originalLanguage = data[i]['language']
            data2.Movies.push(row);
        }

    }
    return data2
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

function createRDFXML(data, type, word=false){
    console.log('createXMLRDF')
    let data2 = '<?xml version="1.0"?>\n<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:nbnc = "https://netflixbutnochill.herokuapp.com/vocabulary">'
    if (type == 'region') {
        for (let i = 0; i < data.length; i++) {
            let row = ""
            row = row.concat("<nbnc:hasCode>", data[i]['Code'], "</nbnc:hasCode>")
            row = row.concat("<nbnc:Region>", data[i]['Libelle'], "</nbnc:Region>")
            try {
                row = row.concat("<nbnc:hasTauxChomage>", data[i]['T2_2020'], "</nbnc:hasTauxChomage>")
                row = row.concat("<nbnc:hasDate>", data[i]['current_condition']['date'], "</nbnc:hasDate>")
                row = row.concat("<nbnc:hasHour>", data[i]['current_condition']['hour'], "</nbnc:hasHour>")
                row = row.concat("<nbnc:hasTemperature>", data[i]['current_condition']['tmp'], "</nbnc:hasTemperature>")
                row = row.concat("<nbnc:hasVitesseDuVent>", data[i]['current_condition']['wnd_spd'], "</nbnc:hasVitesseDuVent>")
                row = row.concat("<nbnc:hasDirectionDuVent>", data[i]['current_condition']['wnd_dir'], "</nbnc:hasDirectionDuVent>")
                row = row.concat("<nbnc:hasPression>", data[i]['current_condition']['pressure'], "</nbnc:hasPression>")
                row = row.concat("<nbnc:hasHumidite>", data[i]['current_condition']['humidity'], "</nbnc:hasHumidite>")
                row = row.concat("<nbnc:hasConditionClimatique>", data[i]['current_condition']['condition'], "</nbnc:hasConditionClimatique>")
            } catch (e) {}
            
            data2 = data2.concat(row, '</rdf:RDF>');
        }
    }

    if (type == 'films') {
        console.log('createXMLRDF')
        let data2 = '<?xml version="1.0"?>\n<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:nbnc = "https://netflixbutnochill.herokuapp.com/vocabulary">'
        data2 = data2.concat("<nbnc:hasWord>", word, "</nbnc:hasWord>")
        for (let i = 0; i < data.length; i++) {
            let row = ""
            try{
            row = row.concat("<nbnc:hasTitre>", data[i]['title'], "</nbnc:hasTitre>")
            row = row.concat("<nbnc:hasOriginalTitre>", data[i]['original_title'], "</nbnc:hasOriginalTitre>")
            row = row.concat("<nbnc:hasProductionYear>", data[i]['production_year'], "</nbnc:hasProductionYear>")
            row = row.concat("<nbnc:hasReleaseDate>", data[i]['original_release_date'], "</nbnc:hasReleaseDate>")
            row = row.concat("<nbnc:hasDirector>", data[i]['director'], "</nbnc:hasDirector>")
            row = row.concat("<nbnc:hasLength>", data[i]['length'], "</nbnc:hasLength>")
            row = row.concat("<nbnc:hasCollectionGenres>", data[i]['genres'], "</nbnc:hasCollectionGenres>")
            row = row.concat("<nbnc:hasOriginalLanguage>", data[i]['language'], "</nbnc:hasOriginalLanguage>")
            }catch(e){}
            data2 = data2.concat(row, '</rdf:RDF>');
        }
    }

    if (type == 'trends') {
        console.log('createXMLRDF')
        let data2 = '<?xml version="1.0"?>\n<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:nbnc = "https://netflixbutnochill.herokuapp.com/vocabulary">'
        data2 = data2.concat("<nbnc:hasWord>", word, "</nbnc:hasWord>")
        data2 = data2.concat("<nbnc:hasPopularite>", data[0][0].value[0], "</nbnc:hasPopularite>")
        for (let i = 0; i < data.length; i++) {
            let row = ""
            try{
            row = row.concat("<nbnc:hasTitre>", data[i]['title'], "</nbnc:hasTitre>")
            row = row.concat("<nbnc:hasOriginalTitre>", data[i]['original_title'], "</nbnc:hasOriginalTitre>")
            row = row.concat("<nbnc:hasProductionYear>", data[i]['production_year'], "</nbnc:hasProductionYear>")
            row = row.concat("<nbnc:hasReleaseDate>", data[i]['original_release_date'], "</nbnc:hasReleaseDate>")
            row = row.concat("<nbnc:hasDirector>", data[i]['director'], "</nbnc:hasDirector>")
            row = row.concat("<nbnc:hasLength>", data[i]['length'], "</nbnc:hasLength>")
            row = row.concat("<nbnc:hasCollectionGenres>", data[i]['genres'], "</nbnc:hasCollectionGenres>")
            row = row.concat("<nbnc:hasOriginalLanguage>", data[i]['language'], "</nbnc:hasOriginalLanguage>")
            }catch(e){}
            data2 = data2.concat(row, '</rdf:RDF>');
        }

    }
    return data2
}


export { cleanData, mergeData, mergeDataNoJointure, createRDFXML };