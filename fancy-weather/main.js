const weatherApiKey = '904d9115373ba6faa8fdaf1c4e85c05d';


const localeStrings = {
    "ru" : {
        "feels-like" : "ощущается",
        "wind" : "ветер",
        "humidity" : "влажность",
        "search": "поиск",
        "latitude": "Широта",
        "longitude": "Долгота"
    }, 
    "en" : {
        "feels-like" : "feels as if its",
        "wind" : "wind",
        "humidity" : "humidity",
        "search": "search",
        "latitude": "Latitude",
        "longitude": "Longitude"
    }
}




class ConfigurationClass {

    constructor() {
        let storageLocale = localStorage.getItem("locale");
        let storageScale = localStorage.getItem("scale");
        let storageCity = localStorage.getItem("city");
        if (storageLocale == null) {
            this._locale = "ru";
        } else {
            this._locale = storageLocale;
        }

        if (storageScale == null) {
            this._scale = "celcius";
        } else {
            this._scale = storageScale;
            if (this._scale == "farenheit") {
                animateSlider();
            }
        }

        if (storageCity == null) {
            this._city = "Minsk";
        } else {
            this._city = storageCity;
        }
    }

    _coordinates = []
    _timezoneOffset = 0

    set locale(value) {
        this._locale = value;

        let activeChoice = document.getElementById("active-option");
        activeChoice.innerText = this._locale.toUpperCase();

        const feelsLikeLabel = document.getElementById("feels-like-label");
        const windLabel = document.getElementById("wind-label");
        const humidityLabel = document.getElementById("humidity-label");
        const searchButton = document.getElementById("search-button");
        const longitudeLabel = document.getElementById("longitude-label");
        const latitudeLabel = document.getElementById("latitude-label");

        feelsLikeLabel.innerHTML = localeStrings[value]["feels-like"];
        windLabel.innerHTML = localeStrings[value]["wind"];
        humidityLabel.innerHTML = localeStrings[value]["humidity"];
        searchButton.innerHTML = "<h4>" + localeStrings[value]["search"] + "</h4>";
        longitudeLabel.innerHTML = localeStrings[value]["longitude"];
        latitudeLabel.innerHTML = localeStrings[value]["latitude"];
        
        setWeather();
        localStorage.setItem("locale", this._locale);
    }
    get locale() {
        return this._locale;
    }
    set coordinates(value) {
        this._coordinates = value;
        setByCoordinates(value);
        updateMap(value);
    }
    get coordinates() {
        return this._coordinates;
    }
    set city(value) {
        this._city = value;
        setWeather();
        localStorage.setItem("city", this._city);

    }
    get city() {
        return this._city;
    }
    set scale(value) {
        this._scale = value;
        if (this._scale == "celcius") {
            convertToCelcius(document.getElementById('temperature-value'));
            convertToCelcius(document.getElementById('feels-like-value'));
            convertToCelcius(document.getElementsByClassName('future-temperature')[0]);
            convertToCelcius(document.getElementsByClassName('future-temperature')[1]);
            convertToCelcius(document.getElementsByClassName('future-temperature')[2]);
        } else if (this._scale == "farenheit") {
            convertToFarenheit(document.getElementById('temperature-value'));
            convertToFarenheit(document.getElementById('feels-like-value'));
            convertToFarenheit(document.getElementsByClassName('future-temperature')[0]);
            convertToFarenheit(document.getElementsByClassName('future-temperature')[1]);
            convertToFarenheit(document.getElementsByClassName('future-temperature')[2]);
        }
        localStorage.setItem("scale", this._scale);
    }
    get scale() {
        return this._scale;
    }
};

let myConfig = new ConfigurationClass();
myConfig.city = myConfig.city;
myConfig.locale = myConfig.locale;
myConfig.scale = myConfig.scale;





let unsplashApiKey = '4JcB4ORFJY-2tlpIZZ5Q75FDfJ9o9NrbxKA9nMgSCqU';
let unsplashApiSecret = '5M2rMmVev-Cy4jSiJeH9L4KitCl_gHyVRo4Wy5EV0Ko';

async function getPhoto() {

    let nowTimestamp = Date.now();
    let currentOffset = new Date().getTimezoneOffset() * 60 * 1000;
    let newOffset = myConfig._timezoneOffset * 1000;
    let date = new Date( nowTimestamp + currentOffset + newOffset);

    let dateOptions = {month : 'numeric'};
    let month = (parseInt(date.toLocaleString("en", dateOptions)) + 1) % 12;
    console.log(month);

    let season = month <= 3 ? "winter" : month <= 6 ? "spring" : month <= 9 ? "summer" : "autumn";
    let hour = date.getHours();
    let daytime =  hour <= 6 ? "night" : hour <= 12 ? "morning" : hour <= 18 ? "day" : "evening";  
    let queryString = `https://api.unsplash.com/photos/random?query=nature&query=animals&client_id=${unsplashApiKey}&query=${season}&query=${daytime}&query=${myConfig.city}`;
    console.log(queryString);
    fetch(queryString).then(
        data => {
            let json = data.json();
            console.log(json);
            return json;
        }
    ).then(
        data => {
            let image = new Image();
            image.onload = () => document.body.style.backgroundImage = `url('${image.src}'`;
            image.src = data.urls.regular;
        }
    );
}

const refreshButton = document.getElementById("refresh");
refreshButton.addEventListener('click', getPhoto);

getPhoto();







var x = 0;
var position = 0;
let temperatureChoice = document.getElementById("temperature-choice");
temperatureChoice.addEventListener("click", animateSlider);
temperatureChoice.addEventListener("click", () => {
    if (myConfig.scale == 'celcius') {
        myConfig.scale = 'farenheit';
    } else {
        myConfig.scale = 'celcius';
    }
});

function animateSlider(e) {
    position = position == 0 ? 1 : 0;
    let temperatureChoiceSlider = document.getElementById("temperature-choice-slider");
    if (x == 0) {
        temperatureChoiceSlider.animate([
            {transform: `translate3D(${x}px, 0, 0)`},
            {transform: 'translate3D(44px, 0, 0)'},
        ], {
            duration: 200,
            iterations: 1, 
            fill: 'forwards'
        });
        x += 44;
    } else  {
        temperatureChoiceSlider.animate([
            {transform: `translate3D(${x}px, 0, 0)`},
            {transform: 'translate3D(0px, 0, 0)'},
        ], {
            duration: 200,
            iterations: 1, 
            fill: 'forwards'
        });
        x -= 44;
    }
};

if (myConfig.scale == "farenheit") {
    animateSlider();
}

function convertToCelcius(domElement) {
    let currentValue = parseInt(domElement.innerHTML.substring(0, domElement.innerHTML.length));
    let newValue = Math.floor((currentValue - 32) * 5 / 9);
    domElement.innerHTML = `${newValue}°`;
}

function convertToFarenheit(domElement) {
    let currentValue = parseInt(domElement.innerHTML.substring(0, domElement.innerHTML.length));
    let newValue = Math.ceil((currentValue * 9 / 5) + 32);
    domElement.innerHTML = `${newValue}°`;
}

const languageChoice = document.getElementById("language-choice");

languageChoice.onclick = () => {
    if (myConfig.locale == "ru") {
        myConfig.locale = "en";
    } else {
        myConfig.locale = "ru";
    }
}






var myMap;
function updateMap(coords) {
    if (myMap != undefined) {
        setLongitudeAndLatitude(coords);
        myMap.setCenter(coords, myMap.getZoom(), {duration : 500}); 
        let myGeoObject = new ymaps.GeoObject({
            // Описание геометрии.
            geometry: {
                type: "Point",
                coordinates: coords
            }
        });
        myMap.geoObjects.removeAll();
        myMap.geoObjects.add(myGeoObject);
    }
}
ymaps.ready(init);
function setLongitudeAndLatitude(coords) {
    let latitude = document.getElementById("latitude-value");
    let convertedLatitude = convertCoordinates(coords[0]);
    latitude.innerHTML = `${convertedLatitude.deg}°${convertedLatitude.minutes}'${convertedLatitude.seconds}`;
    let longitude = document.getElementById("longitude-value");
    let convertedLongitude = convertCoordinates(coords[1]);
    longitude.innerHTML = `${convertedLongitude.deg}°${convertedLongitude.minutes}'${convertedLongitude.seconds}`;
}

function convertCoordinates(coord) {
    let sign = coord >= 0;
    coord = Math.abs(coord);
    let grads = Math.floor(coord);
    coord -= grads;
    coord *= 100;
    let mins = Math.floor(coord / 100 * 60);
    coord -= Math.floor(coord);
    coord *= 100;
    let sec = Math.floor(coord / 100 * 60);
    return {
        deg : sign ? grads : -grads,
        minutes : mins,
        seconds : sec
    }
}

function init() {
    myMap = new ymaps.Map("map", {
        center: myConfig.coordinates,
        zoom: 7
    });

    myMap.controls.remove("fullscreenControl");
    myMap.controls.remove("routeEditor");
    myMap.controls.remove("rulerControl");
    myMap.controls.remove("searchControl");
    myMap.controls.remove("trafficControl");
    myMap.controls.remove("typeSelector");
    myMap.controls.remove("routeButtonControl");
    myMap.controls.remove("routePanelControl");

    setLongitudeAndLatitude(myMap.getCenter());

    let mark = new ymaps.GeoObject({
        geometry: {
            type: "Point",
            coordinates: myMap.getCenter()
        }
    });
    myMap.geoObjects.add(mark);

    myMap.events.add('click', function (e) {
        // Получение координат щелчка
        let coords = e.get('coords');
        console.log(coords);
        myConfig.coordinates = coords;
    });
}






const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("search-button");

searchInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        myConfig.city = searchInput.value;
    }
});

searchButton.addEventListener("click", (e) => {
    console.log(e);
    myConfig.city = searchInput.value;
});





var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.interimResults = true;
recognition.maxAlternatives = 1;

const voice = document.getElementById('voice-img');

voice.onclick = function() {
  recognition.start();
  console.log('start');
  voice.style.animation = 'pulse 1s infinite';
  voice.disabled = true;
}

recognition.onresult = function(event) {
  var city = event.results[0][0].transcript;
  let cityInput = document.getElementById("searchInput");
  cityInput.value = city.replace(/[^a-zA-Zа-яёА-ЯЁ]/u, '');
}

recognition.onspeechend = function() {
  recognition.stop();
  voice.style.animationName = 'none';
  voice.disabled = false;
  let cityInputButton = document.getElementById("search-button");
  cityInputButton.click();

}




async function setWeather() {
    let data = await getWeatherJSON(myConfig.city);
    if (data.cod == 200) {
        let currentWeather = data.list[0];
        setMainWeather(
            currentWeather.weather[0].description, 
            Math.round(currentWeather.main.temp), 
            Math.round(currentWeather.main.feels_like),
            currentWeather.wind.speed,
            currentWeather.main.humidity,
            currentWeather.weather[0].icon);
        let smallWeatherArray = document.getElementsByClassName("small-forecast");
        setSmallWeather(smallWeatherArray[0], data.list[8]);
        setSmallWeather(smallWeatherArray[1], data.list[16]);
        setSmallWeather(smallWeatherArray[2], data.list[24]);
        setCity(data.city.name, data.city.country);

        myConfig._timezoneOffset = data.city.timezone;
        setTime();
        myConfig.coordinates = [data.city.coord.lat, data.city.coord.lon];
    } else {
        alert("Не удалось найти введённый город!");
        console.log(data);
    }
}

async function setByCoordinates(coordinates) {
    let data = await getWeatherJSON(undefined, coordinates);
    if (data.cod == 200) {
        let currentWeather = data.list[0];
        setMainWeather(
            currentWeather.weather[0].description, 
            Math.round(currentWeather.main.temp), 
            Math.round(currentWeather.main.feels_like),
            currentWeather.wind.speed,
            currentWeather.main.humidity,
            currentWeather.weather[0].icon);
        let smallWeatherArray = document.getElementsByClassName("small-forecast");
        setSmallWeather(smallWeatherArray[0], data.list[8]);
        setSmallWeather(smallWeatherArray[1], data.list[16]);
        setSmallWeather(smallWeatherArray[2], data.list[24]);
        setCity(data.city.name, data.city.country);
        myConfig._timezoneOffset = data.city.timezone;
        if (myConfig.scale == "farenheit") {
            myConfig.scale = "farenheit";
        }
        setTime();
        myConfig._coordinates = [data.city.coord.lat, data.city.coord.lon];
    } else {
        alert("Cannot find city!");
        console.log(data);
    }
}

function setTime() {
    let nowTimestamp = Date.now();
    let currentOffset = new Date().getTimezoneOffset() * 60 * 1000;
    let newOffset = myConfig._timezoneOffset * 1000;
    let date = new Date( nowTimestamp + currentOffset + newOffset);

    let options = {weekday : 'long', month: 'long', day: 'numeric', hour: "2-digit", minute: "2-digit", second: "2-digit"};
    const dateTimeElement = document.getElementById("date-time");

    dateTimeElement.innerHTML = date.toLocaleString(myConfig.locale, options);
    setTimeout(setTime, 1000);
}

async function getWeatherJSON(city, coords) 
{
    let link;
    if (city != undefined) {
        link = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric&lang=${myConfig.locale}`;
    } else {
        link = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords[0]}&lon=${coords[1]}&appid=${weatherApiKey}&units=metric&lang=${myConfig.locale}`;
    }
    let response = await fetch(link);
    return await response.json();
}

function setCity(city, region) {
    const countryCityElement = document.getElementById("country-city");
    myConfig._city = city;
    localStorage.setItem("city", city);
    let regionFull = new Intl.DisplayNames([myConfig.locale], {type: 'region'}).of(region);
    countryCityElement.innerHTML = `${city}, ${regionFull}`;
}

function setMainWeather(description, temperature, feelsLike, wind, humidity, iconCode) {
    const temperatureElement = document.getElementById("temperature-value");
    const descriptionElement = document.getElementById("description");
    const feelsLikeElement = document.getElementById("feels-like-value");
    const windElement = document.getElementById("wind-value");
    const humidityElement = document.getElementById("humidity-value");
    const mainIconElement = document.getElementById("main-weather-image").getElementsByTagName("img")[0];

    descriptionElement.innerHTML = description;
    temperatureElement.innerHTML = temperature + '°';
    feelsLikeElement.innerHTML = feelsLike;
    windElement.innerHTML = wind;
    humidityElement.innerHTML = humidity;
    let iconLink = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    mainIconElement.setAttribute("src", iconLink);
}

function setSmallWeather(domElement, jsonData) {
    let temperature = jsonData.main.temp;
    let iconCode = jsonData.weather[0].icon;
    let date = new Date(jsonData.dt * 1000);
    let weekDay = date.toLocaleDateString(myConfig.locale, { weekday: 'long' });;

    let weekDayElement = domElement.getElementsByClassName("week-day")[0];
    let temperatureElement = domElement.getElementsByClassName("future-temperature")[0];
    weekDayElement.innerHTML = weekDay;
    temperatureElement.innerHTML = `${Math.floor(temperature)}°`;
    let iconLink = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    let iconElement = domElement.getElementsByClassName("small-weather-icon")[0].getElementsByTagName("img")[0];
    iconElement.setAttribute("src", iconLink);
}
