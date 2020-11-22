var todaysDate = moment().format("MM/DD/YYYY");
var apiKey = "7d67fbbf1192c5612a9f13407d3f8afc";
var city = "";
var enteredCities = [];
var icon = $("<img>");
var homeCity = $("#city-name");
homeCity.text(city);

$(document).ready(function () {
    renderSearchHistory();
    
    // Search Button
    $("#search-btn").on("click", function (event) {
        event.preventDefault();
        if ($("#entered-city").val() !== "") {
            city = $("#entered-city").val();
            enteredCities.push(city);
            cityStorage();
            renderSearchHistory();
            getWeather(city);
        }
        $("#entered-city").val("");
    });

    // User Searches
    function renderSearchHistory() {
        $(".list-group").empty();
        enteredCities = localStorage.getItem("enteredCities");
        enteredCities = JSON.parse(enteredCities);
        if (enteredCities === null) {
            enteredCities = [];
        }
        console.log(enteredCities);
        enteredCities.forEach(function (enteredCity) {
                var liElement = $("<li class=list-group-item>");
                liElement.addClass("city-list");
                liElement.text(enteredCity);
                var removeIcon = $("<img src=X.png>");
                removeIcon.addClass("delete-icon");
                liElement.append(removeIcon);
                $(".list-group").append(liElement);
            });
    }
    // Current Weather
    function getWeather(chosenCity) {
        var url = `https://api.openweathermap.org/data/2.5/weather?q=${chosenCity}&APPID=${apiKey}&units=imperial`;
        homeCity.text(chosenCity + " " + todaysDate + " ");
        $.ajax({
            url: url,
            method: "GET"
        }).done(function (response) {
            console.log("current city response", response);
            function renderCurrentConditions() {
                var iconcode = response.weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                icon.attr('src', iconurl);
                homeCity.append(icon);
                $("#city-temp").text("Temperature | " + response.main.temp + "°F");
                $("#city-humidity").text("Humidity | " + response.main.humidity + "%");
                $("#city-wind-speed").text("Wind Speed | " + response.wind.speed + " MPH");
            }
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            var uvIndexUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&;lon=${longitude}&APPID=${apiKey}`;
            renderCurrentConditions();
            $.ajax({
                url: uvIndexUrl,
                method: "GET"
            }).done(function (response) {
                console.log(response);
                $("#cityNotFound").addClass("hide");
                $("#city-uv-index").text(`UV Index | ${response.value}`);
                $("#begin").addClass("hide");
                $("#weather").removeClass("hide");
            });
        }).fail(function (cityNotFound){
            $("#cityNotFound").removeClass("hide");
            $("#begin").addClass("hide");
            $("#weather").addClass("hide");
            $("#fiveDayForecast").addClass("hide");
            $("#fiveDayCards").addClass("hide");
            console.log("City does not exist", cityNotFound);
        });

        // Five Day Forecast
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/forecast?q=${chosenCity}&mode=json&APPID=${apiKey}&units=imperial`,
            method: "GET"
        }).done(function (response) {
            console.log("forecast info", response);
            var a = 1;
            for (var i = 5; i < response.list.length; i = i + 8) {
                $("#day-" + a).text(response.list[i].dt_txt);
                var iconcode = response.list[i].weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                $("#icon-" + a).attr("src", iconurl);
                $("#temp-" + a).text("Temp: " + response.list[i].main.temp + "°F");
                $("#humidity-" + a).text("Humidity: " + response.list[i].main.humidity + "%");
                a++;
            }
            $("#cityNotFound").addClass("hide");
            $("#fiveDayForecast").removeClass("hide");
            $("#fiveDayCards").removeClass("hide");
        });
    }
});
function cityStorage() {
    localStorage.setItem("enteredCities", JSON.stringify(enteredCities));
}

