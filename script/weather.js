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
        let apiForecast = app.loadFromAPI(); // comment if test without api call
        //let apiForecast = dataBidon; // uncomment if test without api call
        //app.displayData(apiForecast) // uncomment if test without api call      
        
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
        //Main part 
        const weatherTitle = document.querySelector('h2.weather__title');
        weatherTitle.textContent = 'Aujourd\'hui';

        const weatherDay = document.querySelector('div.weather__day');
        weatherDay.textContent = app.dateEpochToFrench(data.DailyForecasts[0].EpochDate);

        const weatherDescription = document.querySelector('div.weather__description');
        weatherDescription.textContent = data.DailyForecasts[0].Day.LongPhrase;

        //Temperatures
        const weatherTemperatureMin = document.querySelector('div.weather__temperature__values--min');
        const  temperatureMin = Math.round(((data.DailyForecasts[0].Temperature.Minimum.Value) - 32) * 5 / 9);
        weatherTemperatureMin.textContent = temperatureMin;

        const weatherTemperatureMax = document.querySelector('div.weather__temperature__values--max');
        weatherTemperatureMax.textContent = Math.round(((data.DailyForecasts[0].Temperature.Maximum.Value) - 32) * 5 / 9);
        //Wind
        const weatherWindSpeed = document.querySelector('div.weather__wind__values');
        const windSpeed = Math.round((data.DailyForecasts[0].Day.Wind.Speed.Value) * 1.609)
        weatherWindSpeed.textContent = `${windSpeed } km/h`;

        const weatherWindOrientation = document.querySelector('div.weather__wind__direction');
        weatherWindOrientation.textContent = data.DailyForecasts[0].Day.Wind.Direction.Localized;

        //Alerts
        if (temperatureMin <= 1){
            const alertFreezing = document.querySelector('.weather__alert--freezing');
            alertFreezing.classList.remove('hidden');
        }
        if (windSpeed >= 60){
            const alertWind = document.querySelector('.weather__alert--wind');
            alertWind.classList.remove('hidden');
        }

        
    },
    /**
     * This calls the API to get the newest data and display them in the html with calling 'displayData'
     */
    loadFromAPI: function () {
        console.log('loadFromAPI');
        let cityKey = '135052';
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
                console.log("Resultat API :");
                console.log(jsonResponse);
                return jsonResponse;
            }).then((jsonResponse) => {
                app.displayData(jsonResponse);
            });
    }
}

document.addEventListener("DOMContentLoaded", app.init);