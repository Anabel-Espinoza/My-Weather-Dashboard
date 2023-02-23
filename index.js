// Variables

let cityInput = document.querySelector('#input-city')
let searchBtn = document.querySelector('#searchBtn')
let cityAndDate = document.querySelector('#cityAndDate')
let key = '...'

let lat = '33.74'
let lon = '-84.39'
let city = 'Atlanta'
let apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + key
// let exampleUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=b0ebef1f0ca803c72a1a14910d82ee3a'

let apiUrlGeoCoding = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + key
// gives lat and long of the city to assign to lat/log variables

fetch(apiUrl)
.then(function(response) {
    if (!response.ok) {
        throw response.json();
    }
    return response.json()
})
.then(function(data) {
    console.log(data)
})

// GET previous cities from localStorage

// PRINT previous cities in list

