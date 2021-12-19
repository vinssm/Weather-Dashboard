
// get current date
 var currentDay = moment().format("dddd, MMMM Do");
 $("#currentDay").text(currentDay);

// Initializing variable..
var savedButton = $(".btn-info");
var buttonPrimary = $("#btn-primary");
var searchInput = $("#userCityInput");
var userInput = "";
var userSearch = []; 
var cityButtonEl = document.querySelector("#saved-cities")


// method for appending table and row for saved cities 
function citySearch() {
    var savedCities = $("#saved-cities");
    var tableRow = $("<tr>");
    var tableHead = $("<th>");
    tableHead.text(userInput).attr("scope", "row").addClass("btn-info");
    tableRow.append(tableHead);
    savedCities.append(tableRow);
}


// to display the saved cities
$("#saved-cities").on("click", ".btn-info", function(event) {
  event.preventDefault();
  var userInput = ($(this).text());
  console.log(this)
   var clickedUserInput = userInput.textContent
   weatherFiveDay(clickedUserInput);
}); 


// Method for City Data
function citiesData() {
  var cityData = JSON.parse(localStorage.getItem("City"));
  if (cityData !== null) {
     userSearch = cityData;
  } else {
      return;
  }
// For loop
  for (i = 0; i < cityData.length; i++) {
    var savedCities = $("#saved-cities");
    var tableRow = $("<tr>");
    var tableHead = $("<th>");
    tableHead.text(cityData[i]).attr("scope", "row").addClass("btn-info");
    tableRow.append(tableHead);
    savedCities.append(tableRow);
  }
}

//  jQuery!!! will only run once the page Document Object Model (DOM) is ready for JavaScript code to execute.
$(document).ready(function () {
  buttonPrimary.on("click", function (event) {
    event.preventDefault();
    weatherFiveDay();
  });

// function for user input 
 function weatherFiveDay() {
    userInput = searchInput.val();
    var cityData = JSON.parse(localStorage.getItem("City"));
    if (cityData == null){
        cityData = [];
        cityData.push(userInput);
        citySearch();
    } else if (cityData !=null && cityData.indexOf(userInput) == -1) {
        citySearch();
        cityData.push(userInput);
    }
    localStorage.setItem("City", JSON.stringify(cityData));
    var toRemove = $("#weatherDisplay");
    toRemove.empty();

    // day Api 
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+userInput+"&appid=6a19be96eeb70a35bda9aeee8aa64618";

    // calling  current weather for City, Temparature, Humidity
    $.ajax({
      url: queryURL,
      type: "get", queryURL     
    }).then(function (response) {
      var userInput = $(".current-city");
      var currentTemp = $(".current-temp");
      var currentHumidity = $(".current-humidity");
      var currentWind = $(".current-wind");
      var currentFeelsLike = $(".current-feels_like"); 
      var currentSunrise= $(".current-sunrise"); 
      var Lat = response.coord.lat;
      var Long = response.coord.lon;
      var currentUV = $(".current-UV");
      var currentUVLon = $(".current-UVLong");
      var fav = response.weather[0].icon;
      var iconURL = "https://openweathermap.org/img/wn/" + fav + ".png";
      userInput.text(response.name + " " + currentDay);
      currentTemp.text("Temperature: " + response.main.temp + "º" + "C");
      currentHumidity.text("Humidity: " + response.main.humidity + "%");
      currentWind.text("Wind Speed: " + response.wind.speed + " MPH");
      currentFeelsLike.text("Feels Like: " + response.main.feels_like);
      currentSunrise.text("Sunrise: " + response.sys.sunrise);
      //console.log(currentUV);
      //currentUV.text("UV : " + response.value);
      var cityIcon = $("<img>");
      cityIcon.attr("src", iconURL);
      userInput.append(cityIcon);

      var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+Lat+"&lon="+Long+"&exclude=minutely,hourly,alerts&appid=4fbc24f7853d01d79e793285ce2fa9a4";
      $.ajax({
        url: queryURL,
        type: "get", queryURL
      }).then(function (response) {
        console.log(response);
        currentUV.text("UV Lat: " + response.lat);
        currentUVLon.text("UV Long: " + response.lon);
      });
     
     });

    // 5day Api 
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+userInput+"&appid=4fbc24f7853d01d79e793285ce2fa9a4";

    // ajax calling
    $.ajax({
      url: queryURL,
      type: "get", queryURL
    }).then(function (response) {
      var weatherHeader = $("#weatherHeader");
      for (i = 0; i < 5; i++) {
        var cityWeather = $("#weatherDisplay");
        weatherHeader =  $("<h2>");
        var h3Tag = $("<h3>");
        var pTag = $("<p>");
        var weatherIcon = $("<img>");
        var fav = response.list[i * 8 + 5].weather[0].icon;
        var iconURL = "https://openweathermap.org/img/wn/" + fav + ".png";
        var date = new Date(response.list[i].dt_txt);
        var dd = date.getDate();
        var mm = date.getMonth();
        var yyyy = date.getFullYear();
        h3Tag.addClass("col-2 img-thumbnail");
        weatherIcon.attr("src", iconURL).addClass("weather-Icon");
        h3Tag.append(weatherIcon);
        pTag.text(
            mm+'/'+dd+'/'+yyyy+"\n"+
            "Temp: " +
              response.list[i + 5].main.temp +
              "ºF\n Humidity :" +
              response.list[i + 5].main.humidity +
              "%\n  Feels Like :" +
              response.list[i + 5].main.feels_like 
          )
          .addClass("weather")
        h3Tag.append(pTag);
        cityWeather.append(h3Tag);
        }

      });
   }

  
});


//cityButtonEl.addEventListener("click", buttonClickHandler);

