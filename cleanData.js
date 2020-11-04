function cleanData(data, type) {
    console.log('on y va')
    let data2 = []

    if (type == 'region') {
        for (let i = 0; i < data.length; i++) {
            let row = {}
            row.Code = data[i]['Code']
            try { row.Date = data[i]['current_condition']['date'] } catch (e) { console.log('oui') }
            try { row.Hour = data[i]['current_condition']['hour'] } catch (e) { console.log('oui') }
            row.Region = data[i]['Libelle']
            try { row.Taux_chomage = data[i]['T2_2020'] } catch (e) { console.log('oui') }
            try { row.Temperature = data[i]['current_condition']['tmp'] } catch (e) { console.log('oui') }
            try { row.Wind_speed = data[i]['current_condition']['wind_spd'] } catch (e) { console.log('oui') }
            try { row.Wind_direction = data[i]['current_condition']['wind_dir'] } catch (e) { console.log('oui') }
            try { row.pressure = data[i]['current_condition']['pressure'] } catch (e) { console.log('oui') }
            try { row.humidity = data[i]['current_condition']['humidity'] } catch (e) { console.log('oui') }
            try { row.condition_climatique = data[i]['current_condition']['condition'] } catch (e) { console.log('oui') }
            data2.push(row);
        }
    }

    return data2
}

export { cleanData };