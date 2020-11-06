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

export { cleanData };