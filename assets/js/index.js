// Variables
let cityInput = document.querySelector('#inputCity')
let searchBtn = document.querySelector('#searchBtn')
let cityAndDate = document.querySelector('#cityAndDate')
let fiveDaysCards = document.querySelector('.fiveDays')
let asideForm = document.querySelector('.aside-form')
// let key = '...'

let modalAlert = document.querySelector('.modal-alert')
let closeModal = document.querySelector('.close-modal')
let SearchedCity = ''

// DEFAULT city = Atlanta
let lat = '33.7489924'
let lon = '-84.3902644'

// Current weather elements
let temp = document.querySelector(".temp")
let wind = document.querySelector(".wind")
let hum = document.querySelector(".hum")

let currentTemp = document.createElement('p')
let currentWind = document.createElement('p')
let currentHumidity = document.createElement('p')

temp.append(currentTemp)
wind.append(currentWind)
hum.append(currentHumidity)

// Previously searched city elements
let searchedCities = document.createElement('div')
asideForm.append(searchedCities)


// STORE user input city for weather functions
function assignCity() {
    searchedCity = cityInput.value
    getLatLon()
}

// GET lat and log from city input with Geocoding API
function getLatLon() {
    console.log('clicked', searchedCity)
    if (searchedCity) {
        let apiUrlGeoCoding = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchedCity + '&appid=' + key
        console.log(searchedCity)
        fetch(apiUrlGeoCoding)
        .then(function(response) {
            if (!response.ok) {
                throw response.json();
            }
        return response.json()
        })
        .then(function(data) {
            console.log(data)
            if (data.length === 0) {
                // alert ('City not found')
                // let modal = document.querySelector('.modal')
                // let alertMessage = document.querySelector('.alert')
                // alertMessage.classList.add('show')
                // alertModal()  
                modalAlert.classList.add('show')
  
            } else {
                lat = data[0].lat
                lon = data[0].lon
                console.log('lat', lat, 'lon', lon)
                saveCityLocalStorage()
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
    searchedCities.classList.add('d-grid', 'gap-2', 'mx-auto', 'mt-2')
    if (allCities !== null) { 
        for (let i=0; i < allCities.length; i++) {
            let cityBtn = document.createElement('button')
            cityBtn.classList.add('btn', 'btn-sm', 'btn-secondary', 'city-buttons')
            cityBtn.setAttribute('type', 'button')
            cityBtn.textContent = allCities[i]
            searchedCities.append(cityBtn)
            cityBtn.addEventListener('click', getCityFromBtn)
        }
    }
}

// SAVE new searched city in localStorage
function saveCityLocalStorage () {
    if (cityInput.value) {
        allCities.unshift(cityInput.value)
        if (allCities.length > 7) {
            allCities.pop()
        }
        localStorage.setItem('allCities', JSON.stringify(allCities))
        printCitiesLocalStorage()
    }
    cityInput.value = ""
}

// GET weather by clicking city buttons
function getCityFromBtn(event) {
    console.log ('clicked city')
    let clickedBtn = event.target
    console.log (clickedBtn.textContent)
    searchedCity = clickedBtn.textContent
    getLatLon()
}

// Event listeners
searchBtn.addEventListener('click', assignCity)
closeModal.addEventListener('click', function() {
    modalAlert.classList.remove('show')
})

// LOAD page with default city Atlanta
getCurrentWeather()
get5DayForecast ()
printCitiesLocalStorage()