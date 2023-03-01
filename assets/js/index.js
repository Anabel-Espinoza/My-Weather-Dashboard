// Variables
let cityInput = document.querySelector('#inputCity')
let searchBtn = document.querySelector('#searchBtn')
let asideForm = document.querySelector('.aside-form')
let key = 'b0ebef1f0ca803c72a1a14910d82ee3a'
let mainContent = document.querySelector('.main-content')
let modalAlert = document.querySelector('.modal-alert')
let closeModal = document.querySelector('.close-modal')
let alertMessage = document.querySelector('.alert-message')
let searchedCity = ''
let lat = ''
let lon = ''

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
                alertMessage.textContent = "The city was not found, please try again."
                modalAlert.classList.add('show')
            } else {
                lat = data[0].lat
                lon = data[0].lon
                console.log('lat', lat, 'lon', lon)
                saveCityLocalStorage()
                getCurrentWeather()
            }
        })
    } else {
        alertMessage.textContent = "Enter city name."
        modalAlert.classList.add('show')
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
        console.log(data)
        mainContent.innerHTML = ""
        let localTimeZone = (data.timezone)/3600
        let date = dayjs.utc().add(localTimeZone, 'hour').format('MMM D, YY')

        // Current weather elements
        let currentWeatherCard = document.createElement('div')
        let cityAndDate = document.createElement('h3')
        let dataRow = document.createElement('div')

        cityAndDate.textContent = data.name + ' (' + date + ')' 
        let iconCode = data.weather[0].icon

        currentWeatherCard.setAttribute('class', 'bg-gradient main-card card mb-3 p-3')
        dataRow.setAttribute('class', 'row justify-content-around current-weather')

        mainContent.append(currentWeatherCard)
        currentWeatherCard.append(cityAndDate)
        currentWeatherCard.append(dataRow)

        let temp = document.createElement("div")
        let wind = document.createElement("div")
        let hum = document.createElement("div")

        temp.setAttribute('class', 'col-lg-3 text-center')
        wind.setAttribute('class', 'col-lg-3 text-center')
        hum.setAttribute('class', 'col-lg-3 text-center')

        let tempIcon = document.createElement('span')
        tempIcon.setAttribute('class','material-symbols-outlined')
        tempIcon.innerText= 'device_thermostat'

        let windIcon = document.createElement('span')
        windIcon.setAttribute('class','material-symbols-outlined')
        windIcon.innerText= 'air'

        let humIcon = document.createElement('span')
        humIcon.setAttribute('class','material-symbols-outlined')
        humIcon.innerText= 'humidity_percentage'

        let currentTemp = document.createElement('p')
        let currentWind = document.createElement('p')
        let currentHumidity = document.createElement('p')

        temp.append(tempIcon, currentTemp)
        wind.append(windIcon, currentWind)
        hum.append(humIcon, currentHumidity)

        dataRow.append(temp, wind, hum)

        // GET icon for current weather condition
        let icon = document.createElement('img')
        icon.setAttribute('src', 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png')
        icon.setAttribute('width', '50px')
        cityAndDate.appendChild(icon)
        
        // SET current temp, wind speend, and humidity
        currentTemp.textContent = 'Temp: ' + data.main.temp + '°F'
        currentWind.textContent = 'Wind: ' + data.wind.speed + ' mph'
        currentHumidity.textContent = 'Humidity: ' + data.main.humidity + "%"
    })
    get5DayForecast()
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
        
        let fiveDaysCards = document.createElement('div')
        fiveDaysCards.setAttribute('class', 'row justify-content-around fiveDays')
        mainContent.append(fiveDaysCards)
        
        let fiveDayheading = document.createElement('h4')
        fiveDayheading.textContent = '5-day Forecast: '
        fiveDaysCards.append(fiveDayheading)
        
        // API gives forecast for every 3 hours, spacing to get 1 per day = 24/3.
        let spaceIndex = 8;
        // FILL forecast cards 5 days
        for (let i=0; i < 5; i++) {
            console.log(spaceIndex * (i+1) -1)
            
            let card = document.createElement('div')
            let dateCard = document.createElement('h5')
            let iconForecast = document.createElement('img')
            let forecastTemp = document.createElement('li')
            let forecastWind = document.createElement('li')
            let forecastHum = document.createElement('li')

            console.log('timezone in hrs', data.city.timezone/3600)
            let timeZone = data.city.timezone/3600
            let utcFromApi = data.list[spaceIndex * (i+1)-1].dt_txt
            let utc = dayjs(utcFromApi)
            console.log('utc', dayjs(utc).format('MMM DD YY, HH A'))
            let localTime = utc.add(timeZone, 'hour')
            console.log('local time', dayjs(localTime).format('MMM DD YY, HH A'))

            dateCard.textContent = dayjs(localTime).format('MMM D, YY')

            let iconCard = data.list[spaceIndex * (i+1)-1].weather[0].icon
            iconForecast.setAttribute('src', 'http://openweathermap.org/img/wn/' + iconCard + '@2x.png')
            iconForecast.setAttribute('width', '50px')
            card.setAttribute('class', 'col-lg-2 col-md-4 col-sm-6 m-1 p-3 bg-gradient day-card')

            forecastTemp.textContent = 'Temp: ' + data.list[spaceIndex * (i+1)-1].main.temp + ' °F'
            forecastWind.textContent = 'Wind: ' + data.list[spaceIndex * (i+1)-1].wind.speed + ' mph'
            forecastHum.textContent = 'Humidity: ' + data.list[spaceIndex * (i+1)-1].main.humidity + ' %'
            
            card.append(dateCard, iconForecast, forecastTemp, forecastWind, forecastHum)
            fiveDaysCards.append(card)
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

// SAVE new searched city in localStorage. 
// First check city is not already in local storage array. Store up to 7 cities
function saveCityLocalStorage () {
    if (cityInput.value) {
        let isRepeated = false
        for (let i=0; i < allCities.length; i++){
            if (cityInput.value === allCities[i]){
                isRepeated = true
                cityInput.value = ""
                return
            }
        }
        if (isRepeated === false) {
            allCities.unshift(cityInput.value)
            if (allCities.length > 7) {
                allCities.pop()
            }
            localStorage.setItem('allCities', JSON.stringify(allCities))
            printCitiesLocalStorage()
        }
        cityInput.value = ""
    }
}

// GET weather by clicking city buttons
function getCityFromBtn(event) {
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

printCitiesLocalStorage()