//---------- NOTES ----------//
// api language localization fr-fr for france
// I'm going to use fetch to call the API
// Paris APIkey 623  // St dié : 135052
// Les degrés sont récupérés en Farenheit, formule pour changer : (Farenheit - 32) x 5/9 = Celsius
// mi/h en km/h 1mile = 1.609 km
// format dates yyyy-mm-ddThh:mm
//---------------------------//
const app = {
    init: function () {
        let apiForecast = app.loadFromAPI();
        console.log('apiforecast');
        console.log(apiForecast);
        //let apiForecast = dataBidon; // à changer avec API
        //console.log(apiForecast.Headline.Text);

        //let testDate = dataBidon.DailyForecasts[0].EpochDate;
        //console.log('TEST')
        //console.log(app.dateEpochToFrench(testDate));
        //app.displayData(apiForecast);
    },
    /**
     * Convert a timestamp (epoch) in a javascript date object localized in french
     * @param {string} epoch  timestamp
     * @returns javascript date object (example: Lundi 1 janvier 2023)
     */
    dateEpochToFrench: function (epoch) {
        let options = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }
        return new Date(epoch * 1000).toLocaleDateString('fr-FR', options);
    },
    /**
     *
     * @param {object} data object of data to display
     */
    displayData: function (data) {
        const container = document.querySelector('#container');
        const weatherTitle = document.querySelector('h2.weather__title');
        const weatherDay = document.querySelector('div.weather__day');
        const weatherDescription = document.querySelector('div.weather__description');
        const weatherTemperature = document.querySelector('div.weather__temperature');
        const weatherWind = document.querySelector('div.weather__wind');
        weatherTitle.textContent = 'Météo d\'aujourd\'hui';
        weatherDay.textContent = app.dateEpochToFrench(data.DailyForecasts[0].EpochDate);
        weatherDescription.textContent = data.DailyForecasts[0].Day.LongPhrase
        weatherTemperature.textContent = `Minimale: ${Math.round(((data.DailyForecasts[0].Temperature.Minimum.Value) -32)*5/9)}°C et maximale: ${Math.round(((data.DailyForecasts[0].Temperature.Maximum.Value) -32)*5/9)}°C`
        weatherWind.textContent = `Vitesse du vent : ${Math.round((data.DailyForecasts[0].Day.Wind.Speed.Value)*1.609)}km/h  Orientation : ${data.DailyForecasts[0].Day.Wind.Direction.Localized}`
    },
    /**
     * This calls the API to get the newest data and display them in the html with calling 'displayData'
     */
    loadFromAPI: function () {
        console.log('loadFromAPI');
        let cityKey = '135052'
        let MyURL = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${cityKey}?apikey=${apiKeyAuth}&language=fr-fr&details=true&metric=true HTTP/1.1`;
        let myOptions = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            apikey: apiKeyAuth,
            language: 'fr-fr',
            details: true,
            metric: true,
        };

        fetch(MyURL, myOptions).then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                console.log("Resultat API :")
                console.log(jsonResponse)
                return jsonResponse
            }).then((jsonResponse) => {
                app.displayData(jsonResponse)
            });
    }
}

document.addEventListener("DOMContentLoaded", app.init);