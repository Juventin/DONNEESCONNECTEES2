function cleanData(data, type) {
    console.log(data)
    console.log('Cleaning')
    let data2 = []

    if (type == 'region') {
        for (let i = 0; i < data.length; i++) {
            let row = {}
            row.Code = data[i]['Code']
            row.Region = data[i]['Libelle']
            try {
                row.Date = data[i]['current_condition']['date']
                row.Hour = data[i]['current_condition']['hour']
                row.Taux_chomage = data[i]['T2_2020']
                row.Meteo = []
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
        data2.Code_region = data[0][0]['Code']
        data2.Region = data[0][0]['Libelle']
        data2.Date = data[0][0]['Date']
        data2.Hour = data[0][0]['Hour']
        data2.Taux_chomage = data[0][0]['Taux_chomage']
        data2.Meteo = []
        data2.Meteo.Temperature = data[0][0]['Temperature']
        data2.Meteo.Wind_speed = data[0][0]['Wind_speed']
        data2.Meteo.Wind_direction = data[0][0]['Wind_direction']
        data2.Meteo.pressure = data[0][0]['pressure']
        data2.Meteo.humidity = data[0][0]['humidity']
        data2.Meteo.condition_climatique = data[0][0]['condition_climatique']
        data2.Popularite = data[0][0]['value'][0]
        data2.Films = []
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
            data2.Films.push(row);
        }
        console.log(data2)
    }

    return data2
}

export { cleanData };