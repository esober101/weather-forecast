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


});
function cityStorage() {
    localStorage.setItem("enteredCities", JSON.stringify(enteredCities));
}

