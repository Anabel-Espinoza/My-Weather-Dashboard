// Variables

let cityInput = document.querySelector('#inputCity')
let searchBtn = document.querySelector('#searchBtn')
let cityAndDate = document.querySelector('#cityAndDate')
let mainCard = document.querySelector('.main-card')
let fiveDaysCards = document.querySelector('.fiveDays')
let asideForm = document.querySelector('.aside-form')
// let key = '...'

// Current weather elements
let currentTemp = document.createElement('li')
let currentWind = document.createElement('li')
let currentHumidity = document.createElement('li')
mainCard.append(currentTemp, currentWind, currentHumidity)

let searchedCities = document.createElement('ul')
asideForm.append(searchedCities)

// DEFAULT city = Atlanta
let lat = '33.7489924'
let lon = '-84.3902644'

// GET lat and log from city input with Geocoding API
function getLatLon() {
    console.log('clicked', cityInput.value)
    if (cityInput.value) {
        let apiUrlGeoCoding = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityInput.value + '&appid=' + key
        console.log(cityInput.value)
        saveCityLocalStorage()
        fetch(apiUrlGeoCoding)
        .then(function(response) {
            if (!response.ok) {
                throw response.json();
            }
        return response.json()
        })
        .then(function(data) {
            console.log(data)
            // FORMAT this !!!
            if (data.length === 0) {
                alert ('City not found')
                let modal = document.querySelector('.modal')
                // let alertMessage = document.querySelector('.alert')
                alertModal()  
  
            } else {
                lat = data[0].lat
                lon = data[0].lon
                console.log('lat', lat, 'lon', lon)
                getCurrentWeather()
                get5DayForecast()
            }
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
        // empty previous data in cards
        for (let i=0; i < fiveDaysCards.children.length; i++) {
            fiveDaysCards.children[i].textContent = ""
        }
        // API gives forecast for every 3 hours, spacing to get 1 per day = 24/3. (But no array index 40)
        let spaceIndex = 8;
        // FILL forecast cards 5 days
        for (let i=0; i < fiveDaysCards.children.length; i++) {
            console.log(spaceIndex * (i+1) -1)
            let dateCard = document.createElement('h5')
            let iconForecast = document.createElement('img')
            let forecastTemp = document.createElement('li')
            let forecastWind = document.createElement('li')
            let forecastHum = document.createElement('li')
            
            let dateTime = (data.list[spaceIndex * (i+1)-1].dt_txt).split(" ")
            dateCard.textContent = dayjs(dateTime[0]).format('MMM DD, YY')

            let iconCard = data.list[spaceIndex * (i+1)-1].weather[0].icon
            iconForecast.setAttribute('src', 'http://openweathermap.org/img/wn/' + iconCard + '@2x.png')
            iconForecast.setAttribute('width', '50px')

            forecastTemp.textContent = 'Temp: ' + data.list[spaceIndex * (i+1)-1].main.temp + ' °F'
            forecastWind.textContent = 'Wind: ' + data.list[spaceIndex * (i+1)-1].wind.speed + ' mph'
            forecastHum.textContent = 'Humidity: ' + data.list[spaceIndex * (i+1)-1].main.humidity + ' %'
            
            fiveDaysCards.children[i].append(dateCard, iconForecast, forecastTemp, forecastWind, forecastHum)
        }
    })
}

// GET previously searched cities from localStorage
let allCities = [];
let citiesFromLocalStorage = JSON.parse(localStorage.getItem('allCities'))
console.log(citiesFromLocalStorage)
if (citiesFromLocalStorage) {
    allCities = citiesFromLocalStorage;
}

// PRINT previous cities in list
function printCitiesLocalStorage() {
    searchedCities.textContent = ""
    if (allCities !== null) { 

        for (let i=0; i < allCities.length; i++) {
            let cityLi = document.createElement('li')
            cityLi.textContent = allCities[i]
            searchedCities.append(cityLi)
        }
    }
}

// SAVE new searched city in localStorage
function saveCityLocalStorage () {
    let newCity= cityInput.value
    allCities.push(newCity)
    localStorage.setItem('allCities', JSON.stringify(allCities))
    if (allCities.length > 8) {
        allCities.shift()
    }
    printCitiesLocalStorage()
}

// Event listeners
searchBtn.addEventListener('click', getLatLon)



// LOAD page with default city Atlanta
getCurrentWeather()
get5DayForecast ()
printCitiesLocalStorage()