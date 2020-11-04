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
                row.Temperature = data[i]['current_condition']['tmp']
                row.Wind_speed = data[i]['current_condition']['wnd_spd']
                row.Wind_direction = data[i]['current_condition']['wnd_dir']
                row.pressure = data[i]['current_condition']['pressure']
                row.humidity = data[i]['current_condition']['humidity']
                row.condition_climatique = data[i]['current_condition']['condition']
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
            row.Code_region = data[i]['Code']
            row.Region = data[i]['Libelle']
            row.Date = data[i][0]['Date']
            row.Hour = data[i][0]['Hour']
            row.Taux_chomage = data[i][0]['Taux_chomage']
            row.Temperature = data[i][0]['Temperature']
            row.Wind_speed = data[i][0]['Wind_speed']
            row.Wind_direction = data[i][0]['Wind_direction']
            row.pressure = data[i][0]['pressure']
            row.humidity = data[i][0]['humidity']
            row.condition_climatique = data[i][0]['condition_climatique']
            row.Popularite = data[i][0]['value'][0]
            data2.push(row);
        }
    }

    return data2
}

export { cleanData };