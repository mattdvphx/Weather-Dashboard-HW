let queryUrlBase = 'https://api.openweathermap.org/data/2.5/weather?q=';
let fiveDayUrlBase = 'https://api.openweathermap.org/data/2.5/forecast?q='
let apikey = '&appid=0cf78313188ed7c923c873cd418f1e41';

let recentSearchArray = JSON.parse(localStorage.getItem("recentSearchArray")) || [];
let mostRecentSearch = JSON.parse(localStorage.getItem("mostRecentSearch"));
let recentSearchBtns = $(".recentSearch");

function presentweather(actual) {
    $.ajax({
        url: actual,
        method: "GET"
    }).then(function (reply) {
        console.log("actual Weather: ")
        console.log(reply);
        $("#mainIcon").attr('src', `https://openweathermap.org/img/w/${reply.weather[0].icon}.png`)
        $("#mainIcon").attr('alt', `${reply.weather[0].description}`)
        $("#actualTemp").text("Temperature: " + Math.round(reply.main.temp) + " F");
        $("#actualHumid").text("Humidity: " + reply.main.humidity + "%");
        $("#actualWind").text("Wind Speed: " + reply.wind.speed + "MPH");

        let queryUrlUv = `https://api.openweathermap.org/data/2.5/uvi/forecast?` + `appid=0cf78313188ed7c923c873cd418f1e41` + `&lat=${reply.coord.lat}&lon=${reply.coord.lon}&cnt=1`
        $.ajax({
            url: queryUrlUv,
            method: "GET"
        }).then(function (responseUv) {
            $("#actualUv").text("UV index: " + responseUv[0].value)
        })
    })
};
function emptyCards() {
    for (let i = 0; i < 5; i++) {
        $("#card" + i).empty();
    }
}
function renderSearchedCities() {
    $.each(recentSearchArray, function (index, object) {
        let newSearchBtn = $('<li class=".recentSearch">');
        newSearchBtn.text(object.city);
        recentSearchBtns.append(newSearchBtn);
    })
}
function fiveDayWeather(fiveDay) {
    emptyCards();
    $.ajax({
        url: fiveDay,
        method: "GET"
    }).then(function (responseFive) {
        console.log("Five Day Forecast: ")
        console.log(responseFive);
        $("#presentweatherCity").text(responseFive.city.name);
        let j = 0;
        for (let i = 0; i < 39; i += 8) {

            let forecastNewBody = $(`<div class="card-body${j}"></div>`);
            let forecastNewIcon = $(`<img src="" alt="">`);
            let forecastNewTemp = $(`<p class="card-text"></p>`);
            let forecastNewHumid = $(`<p class="card-text"></p>`);

            forecastNewIcon.attr('src', `https://openweathermap.org/img/w/${responseFive.list[i].weather[0].icon}.png`);
            forecastNewTemp.text('Temperature: ' + responseFive.list[i].main.temp + ' F');
            forecastNewHumid.text('Humidity: ' + responseFive.list[i].main.humidity + '%');
            $("#card" + j).append(forecastNewBody);
            $(".card-body" + j).append(forecastNewIcon);
            $(".card-body" + j).append(forecastNewTemp);
            $(".card-body" + j).append(forecastNewHumid);

            j++;
        }
    })
};

function setDates() {
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

setDates();

$(".btn").on("click", function (event) {
    event.preventDefault();
    let city = $('#citySearched').val().trim();
    console.log(city);
    let presentweatherUrl = queryUrlBase + city + "&units=imperial" + apikey;
    presentweather(presentweatherUrl);
    let fiveDayWeatherUrl = fiveDayUrlBase + city + "&units=imperial" + apikey;
    fiveDayWeather(fiveDayWeatherUrl);

    let cityJSON = {
        city: city
    }

    let newSearchBtn = $('<li class=".recentSearch">');
    newSearchBtn.text(city);
    recentSearchBtns.append(newSearchBtn);

    recentSearchArray.push(cityJSON);
    localStorage.setItem('recentSearchArray', JSON.stringify(recentSearchArray));
    localStorage.setItem('mostRecentSearch', JSON.stringify(city));
})

recentSearchBtns.on("click", function (e) {
    event.preventDefault();
    clickedRecent = $(e.target).text();
    console.log(clickedRecent);
    $('#citySearched').val('');

    let presentweatherUrl = queryUrlBase + clickedRecent + "&units=imperial" + apikey;
    presentweather(presentweatherUrl);

    let fiveDayWeatherUrl = fiveDayUrlBase + clickedRecent + "&units=imperial" + apikey;
    fiveDayWeather(fiveDayWeatherUrl);
    localStorage.setItem('mostRecentSearch', JSON.stringify(clickedRecent))

})

renderSearchedCities();