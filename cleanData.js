function cleanData(data, type) {
    console.log('on y va')
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

    return data2
}

export { cleanData };