function cleanData(data, type) {
    console.log('Cleaning')
    let data2 = []

    if (type == 'trend') {
        for (let i = 0; i < data.length; i++) {
            let row = {}
            row.Popularité = data[i]['value'][0]
            row.geoName = data[i]['geoName']
            data2.push(row);
        }
    }

    if (type == 'region') {
        for (let i = 0; i < data.length; i++) {
            let row = {}
            row.Code = data[i]['Code']
            row.Region = data[i]['Libelle']
            try {
                row.Date = data[i]['current_condition']['date']
                row.Hour = data[i]['current_condition']['hour']
                row.Taux_chomage = data[i]['T2_2020']
                row.Meteo = {}
                row.Meteo.Temperature = data[i]['current_condition']['tmp']
                row.Meteo.Wind_speed = data[i]['current_condition']['wnd_spd']
                row.Meteo.Wind_direction = data[i]['current_condition']['wnd_dir']
                row.Meteo.pressure = data[i]['current_condition']['pressure']
                row.Meteo.humidity = data[i]['current_condition']['humidity']
                row.Meteo.condition_climatique = data[i]['current_condition']['condition']
            } catch (e) {}
            data2.push(row);
        }
    }

    if (type == 'films') {
        for (let i = 0; i < data.length; i++) {
            let row = {}
            row.Id = data[i]['id']
            row.Title = data[i]['title']
            row.Original_title = data[i]['original_title']
            row.Production_year = data[i]['production_year']
            row.Release_date = data[i]['original_release_date']
            row.Director = data[i]['director']
            row.Length = data[i]['length']
            row.Genres = data[i]['genres']
            row.Original_language = data[i]['language']
            data2.push(row);
        }
    }

    if (type == 'trends') {
        data2 = data[0][0]
        data2.Value = data2.value[0]
        delete data2['value']
        delete data2['geoCode']
        delete data2['geoName']
        delete data2['formattedValue']
        delete data2['maxValueIndex']
        delete data2['hasData']
        data2.Films = []
        for (let i = 0; i < data.length; i++) {
            let row = {}
            row.Title = data[i]['title']
            row.Original_title = data[i]['original_title']
            row.Production_year = data[i]['production_year']
            row.Release_date = data[i]['original_release_date']
            row.Director = data[i]['director']
            row.Length = data[i]['length']
            row.Genres = data[i]['genres']
            row.Original_language = data[i]['language']
            data2.Films.push(row);
        }

    }
    return data2
}

export { cleanData };