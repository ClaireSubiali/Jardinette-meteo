//---------- NOTES ----------//
// api language localization fr-fr for france
// I'm going to use fetch to call the API
// Paris APIkey 623  // St dié : 135052
// Les degrés sont récupérés en Farenheit, formule pour changer : (Farenheit - 32) x 5/9 = Celsius
// mi/h en km/h 1mile = 1.609 km
// format dates yyyy-mm-ddThh:mm
//---------------------------//
const app = {
    windDirection: {
        "n": "Nord",
        "e": "Est",
        "s": "Sud",
        "w": "Ouest",
        "nne": "Nord Nord-Est",
        "ese": "Est Sud-Est",
        "ssw": "Sud Sud-Ouest",
        "wnw": "Ouest Nord-Ouest",
        "ne": "Nord-Est",
        "se": "Sud-Est",
        "sw": "Sud-Ouest",
        "nw": "Nord-Ouest",
        "ene": "Est Nord-Est",
        "sse": "Sud Sud-Est",
        "wsw": "Ouest Sud-Ouest",
        "nnw": "Nord Nord-Ouest",
    },
    init: function () {
        let apiForecast = app.loadFromAPI(); // comment if test without api call
        //let apiForecast = dataBidon; // uncomment if test without api call
        //app.displayData(apiForecast) // uncomment if test without api call 
        //console.log("location :", app.getLocation());

        const locMeButton = document.querySelector('button.weather__location__button');
        locMeButton.addEventListener('click', app.getLocation);


    },
    /**
     * Get user location and update the display with loadFromAPI (then displayData)
     */
    getLocation: function () {
        // documentation on MDN : https://developer.mozilla.org/fr/docs/Web/API/Geolocation/getCurrentPosition
        var options = {
            enableHighAccuracy: true,
            timeout: 5000, // integer (milisec) duration before error func is executed, if 0 never executed
            maximumAge: 0 // interger (milisec or) infinity for max time keep in cache position
        };

        function error(err) {
            console.warn(`ERREUR (${err.code}): ${err.message}`);
            alert("Impossible de récupérer votre position, merci d'autoriser la géolocalisation pour utiliser cette fonctionnalité")
            //TODO message d'alerte à perfectionner
        }

        function success(pos) {
            var crd = pos.coords;

            console.log('Votre position actuelle est :');
            console.log(`Latitude : ${crd.latitude}`);
            console.log(crd.latitude);
            console.log(`Longitude : ${crd.longitude}`);
            console.log(crd.longitude);
            console.log(`La précision est de ${crd.accuracy} mètres.`);
            app.loadCityFromAPI((crd.latitude).toString(), (crd.longitude).toString());
            //app.loadCityFromAPI('5','5');
        }

        const location = navigator.geolocation.getCurrentPosition(success, error, options);



    },
    loadCityFromAPI: function (userLat, userLong) {
        console.log('loadCityFromAPI');

        let MyURL = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKeyAuth}&q=${userLat},${userLong}`;
        let myOptions = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            apikey: apiKeyAuth,
        }
        fetch(MyURL, myOptions).then((response) => {
                return response.json();
            })
            .then((jsonResponse) => {
                console.log("Resultat API City :");
                console.log(jsonResponse);
                return jsonResponse;
            }).then((jsonResponse) => {
                console.log('fin ajax, lancement de loadFromAPI');
                app.loadFromAPI(jsonResponse.Key, jsonResponse.LocalizedName)
            });

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
     * @param {object} data object of data to display
     */
    displayData: function (data, cityName) {
        // Main part 
        const weatherTitle = document.querySelector('h2.weather__title');
        weatherTitle.textContent = 'Aujourd\'hui';

        const weatherDay = document.querySelector('div.weather__day');
        weatherDay.textContent = app.dateEpochToFrench(data.DailyForecasts[0].EpochDate);

        const weatherDescription = document.querySelector('div.weather__description');
        weatherDescription.textContent = data.DailyForecasts[0].Day.LongPhrase;

        const weatherIcon = document.querySelector('img.weather__icon');
        weatherIcon.src = `images/${data.DailyForecasts[0].Day.Icon}.png`;

        // Temperatures
        const weatherTemperatureMin = document.querySelector('div.weather__temperature__values--min');
        const temperatureMin = Math.round(((data.DailyForecasts[0].Temperature.Minimum.Value) - 32) * 5 / 9);
        weatherTemperatureMin.textContent = temperatureMin;

        const weatherTemperatureMax = document.querySelector('div.weather__temperature__values--max');
        weatherTemperatureMax.textContent = Math.round(((data.DailyForecasts[0].Temperature.Maximum.Value) - 32) * 5 / 9);

        // Wind
        const weatherWindSpeed = document.querySelector('div.weather__wind__values');
        const windSpeed = Math.round((data.DailyForecasts[0].Day.Wind.Speed.Value) * 1.609);
        weatherWindSpeed.textContent = `${windSpeed } km/h`;

        const weatherWindOrientation = document.querySelector('div.weather__wind__direction');
        const windIcon = document.querySelector('i.wi-wind');
        windIcon.classList.add(`wi-from-${(data.DailyForecasts[0].Day.Wind.Direction.English).toLowerCase()}`);
        windIcon.title = `Provenance du vent : ${app.windDirection[(data.DailyForecasts[0].Day.Wind.Direction.English).toLowerCase()]}`;

        // Update location
        const locName = document.querySelector('span.weather__location__city-name');
        locName.textContent = cityName;
        console.log('new city name', locName.textContent);

        // Alerts
        if (temperatureMin <= 1) {
            const alertFreezing = document.querySelector('.weather__alert--freezing');
            alertFreezing.classList.remove('hidden');
        }
        if (windSpeed >= 60) {
            const alertWind = document.querySelector('.weather__alert--wind');
            alertWind.classList.remove('hidden');
        }
    },
    /**
     * This calls the API to get the newest data and display them in the html with calling 'displayData'
     */
    loadFromAPI: function (cityKey = '623', cityName = 'Paris') {
        console.log('loadFromAPI');
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
                app.displayData(jsonResponse, cityName);
            });
    }
}

document.addEventListener("DOMContentLoaded", app.init);