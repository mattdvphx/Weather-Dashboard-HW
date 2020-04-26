//Declaring variables so java can store it in memory 
let queryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
let fiveDayUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='
let apikey = '&appid=0cf78313188ed7c923c873cd418f1e41';
let prevSearchArray = JSON.parse(localStorage.getItem("recentSearchArray")) || [];
let recentSearch = JSON.parse(localStorage.getItem("mostRecentSearch"));
let prevSearchBtns = $(".recentSearch");

// API function, it calls for the present weather by pushing the data from the server.
function presentWeather(present) {
    $.ajax({
        url: present,
        method: "GET"
    }).then(function (response) {
        console.log("Present Weather: ")
        console.log(response);


    
// below are the API Source it request data from the server based on user inputs on this case temperature, humidity and speed.
        $("#mainIcon").attr('src', `https://openweathermap.org/img/w/${response.weather[0].icon}.png`)
        $("#mainIcon").attr('alt', `${response.weather[0].description}`)
        $("#presentTemp").text("Temperature: " + Math.round(response.main.temp) + " F");
        $("#presentHumid").text("Humidity: " + response.main.humidity + "%");
        $("#presentWind").text("Wind Speed: " + response.wind.speed + "MPH");


// The AJAX call bellow access the API to update the UV content.
        let queryUrlUv = `https://api.openweathermap.org/data/2.5/uvi/forecast?` + `appid=0cf78313188ed7c923c873cd418f1e41` + `&lat=${response.coord.lat}&lon=${response.coord.lon}&cnt=1`
        $.ajax({
            url: queryUrlUv,
            method: "GET"
        }).then(function (responseUv) {
            $("#presentUv").text("UV index: " + responseUv[0].value)
        })
    })
};

// Still trying to understand the code bellow.  From w3 schools, variables decalred with (let) can have a "block scope" which I am still confused about it. 
function emptyCards() {
    for (let i = 0; i < 5; i++) {
        $("#card" + i).empty();
    }
}
//jquery $ function used on the search button to retrieve data from array.
function recentSearchList() {
    $.each(prevSearchArray, function (index, object) {
        let SearchBtn = $('<li class=".recentSearch">');
        SearchBtn.text(object.city);
        prevSearchBtns.append(SearchBtn);
    })
}
function fiveDayWeather(fiveDay) {
    emptyCards();

    $.ajax({
        url: fiveDay,
        // The "GET" is used to load the content from the browser.
        method: "GET"
    }).then(function (responseFiveDay) {
        console.log("Five Day Forecast: ")
        console.log(responseFiveDay);
        $("#presentWeatherCity").text(responseFiveDay.city.name);
        let j = 0;
        for (let i = 0; i < 39; i += 8) {
            let forecastBody = $(`<div class="card-body${j}"></div>`);
            let forecastIcon = $(`<img src="" alt="">`);
            let forecastTemp = $(`<p class="card-text"></p>`);
            let forecastHumid = $(`<p class="card-text"></p>`);
            forecastIcon.attr('src', `https://openweathermap.org/img/w/${responseFiveDay.list[i].weather[0].icon}.png`);
            forecastTemp.text('Temperature: ' + responseFiveDay.list[i].main.temp + ' F');
            forecastHumid.text('Humidity: ' + responseFiveDay.list[i].main.humidity + '%');
            $("#card" + j).append(forecastBody);
            $(".card-body" + j).append(forecastIcon);
            $(".card-body" + j).append(forecastTemp);
            $(".card-body" + j).append(forecastHumid);

            j++;
        }
    })
};

function newDates() {

    let d = new Date();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let output = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + '/' + d.getFullYear();
    $("#todaysDate").text(output);
    for (let i = 0; i < 5; i++) {
        day++;
        output = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + '/' + d.getFullYear();
        $(".date" + i).text(output);
    }
}

newDates();

// Search Button will load the city weather info from API
$(".btn").on("click", function (event) {
    event.preventDefault();
    let city = $('#citySearched').val().trim();
    console.log(city);
    let presentWeatherUrl = queryUrl + city + "&units=imperial" + apikey;
    presentWeather(presentWeatherUrl);
    let fiveDayWeatherUrl = fiveDayUrl + city + "&units=imperial" + apikey;
    fiveDayWeather(fiveDayWeatherUrl);

    let citiesJSON = {
        city: city
    }

    let searchBtn = $('<li class=".recentSearch">');
    searchBtn.text(city);
    prevSearchBtns.append(searchBtn);

    prevSearchArray.push(citiesJSON);
    localStorage.setItem('recentSearchArray', JSON.stringify(prevSearchArray));
    localStorage.setItem('mostRecentSearch', JSON.stringify(city));
})

// The console will save the recently searched cities.
prevSearchBtns.on("click", function (e) {
    event.preventDefault();
    clickedRecent = $(e.target).text();
    console.log(clickedRecent);
    $('#citySearched').val('');

    let presentWeatherUrl = queryUrl + clickedRecent + "&units=imperial" + apikey;
    presentWeather(presentWeatherUrl);

    let fiveDayWeatherUrl = fiveDayUrl + clickedRecent + "&units=imperial" + apikey;
    fiveDayWeather(fiveDayWeatherUrl);
    localStorage.setItem('mostRecentSearch', JSON.stringify(clickedRecent))

})
recentSearchList();