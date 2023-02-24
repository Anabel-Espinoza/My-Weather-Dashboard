// Variables

let cityInput = document.querySelector('#inputCity')
let searchBtn = document.querySelector('#searchBtn')
let cityAndDate = document.querySelector('#cityAndDate')
let mainCard = document.querySelector('.main-card')
let fiveDaysCards = document.querySelector('.fiveDays')
// let key = '...'

// Current weather elements
let currentTemp = document.createElement('li')
let currentWind = document.createElement('li')
let currentHumidity = document.createElement('li')
mainCard.append(currentTemp, currentWind, currentHumidity)


// DEFAULT city = Atlanta
let lat = '33.7489924'
let lon = '-84.3902644'

// GET lat and log from city input with Geocoding API
function getLatLon() {
    console.log('clicked', cityInput.value)
    if (cityInput.value) {
        let apiUrlGeoCoding = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityInput.value + '&appid=' + key
        console.log(cityInput.value)
        fetch(apiUrlGeoCoding)
        .then(function(response) {
            if (!response.ok) {
                throw response.json();
            }
        return response.json()
        })
        .then(function(data) {
            console.log(data)
            lat = data[0].lat
            lon = data[0].lon
            console.log('lat', lat, 'lon', lon)
            getCurrentWeather()
            get5DayForecast()
        })
    }
}

// GET current weather data 
function getCurrentWeather() {    
let currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + key
fetch(currentWeatherUrl)
    .then(function(response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json()
    })
    .then(function(data) {
        // console.log(data)
        // console.log(data.name, data.dt, data.weather[0].icon)
        let dateConvert = dayjs.unix(data.dt)
        let date = dateConvert.format('MMM DD, YY')
        let iconCode = data.weather[0].icon
        
        cityAndDate.textContent = data.name + ' (' + date + ')' 
        
        // MAKE icon for weather condition
        let icon = document.createElement('img')
        icon.setAttribute('src', 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png')
        icon.setAttribute('width', '50px')
        cityAndDate.appendChild(icon)
        
        // SET current temp, wind speend, and humidity
        currentTemp.textContent = 'Temp: ' + data.main.temp + '°F'
        currentWind.textContent = 'Wind: ' + data.wind.speed + ' mph'
        currentHumidity.textContent = 'Humidity: ' + data.main.humidity + "%"

    })
}

// GET weather forecast for the next 5 days
function get5DayForecast() {
let forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + key
fetch (forecastUrl)
    .then (function(response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json()
    })
    .then (function(data) {
        console.log(data)
        console.log(fiveDaysCards.children.length)
        // API gives forecast for every 3 hours, spacing to get 1 per day = 24/3
        let spaceIndex = 8;
        for (let i=0; i < fiveDaysCards.children.length; i++){
            let date = document.createElement('h4')
            let iconforecast = document.createElement('img')
            let forecastTemp = document.createElement('li')
            let forecastWind = document.createElement('li')
            let forecastHum = document.createElement('li')

            date.textContent = data.list[spaceIndex + (i+1)]
            console.log(spaceIndex  * (i+1))
        }
        let dateTime = (data.list[0].dt_txt).split(" ")
        let date = dayjs (dateTime[0]).format('MMM DD, YY')
        let iconCode = data.list[0].weather[0].icon
    })
}


// Event listeners
searchBtn.addEventListener('click', getLatLon)

// GET previous cities from localStorage

// PRINT previous cities in list


// LOAD page with default city Atlanta
getCurrentWeather()
