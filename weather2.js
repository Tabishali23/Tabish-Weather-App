// access required varible 
const apiKey = "febd0e70c35a4b4386a145749260710";
const spanner = document.querySelector("#loader");
const searchBtn = document.querySelector(".btn");
const cityInput = document.querySelector("#type");
const cityHeader = document.querySelector("#cityname");
const weatherContainer = document.querySelector(".container"); 
const temp = document.getElementById("temp");
const minTemp = document.getElementById("mintemp");
const maxTemp = document.getElementById("maxtemp");
const feelLike = document.getElementById("feellike");
const humidity = document.getElementById("humid");
const windSpeed = document.getElementById("wspeed");
const windDirection = document.getElementById("wdir");
const cloudCover = document.getElementById("ccover");
const sunrise = document.getElementById("srise");
const sunset = document.getElementById("sset");
const forecastContainer = document.getElementById("forecast-container");
const uvidx = document.getElementById("uvindex");
const body = document.querySelector("body");



// async function to fetch data so website doesnt stops and better than promises and callbacks
async function  fetchWeather(city) {
    if(!city)  return;

    const URL =`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=3&aqi=no&alerts=no`;
    try {
         spanner.style.display = "flex";
        weatherContainer.style.display = "none";
          const response = await fetch(URL);
        if (!response.ok) throw new Error("City not found");
          const data = await response.json();
        updateUI(data);
                weatherContainer.style.display = "grid";
    } catch (error) {
        console.log("failed to fetch data")
        window.alert("try spelling or your data speed");
    } finally {
        loader.style.display = "none";
    }
}

// this fuction is essential for upgrading the ui data
function updateUI (data) {
    const current = data.current;
     const dayData = data.forecast.forecastday[0].day;
    const astroData = data.forecast.forecastday[0].astro;


    // city name and temperature box population
    cityHeader.textContent = `${data.location.name},${data.location.country}`,
    temp.textContent =  `${Math.round(current.temp_c)}°C`;
    minTemp.textContent = `${Math.round(dayData.mintemp_c)}°C`;
    maxTemp.textContent = `${Math.round(dayData.maxtemp_c)}°C`;
    feelLike.textContent = `${Math.round(current.feelslike_c)}°C`;
    uvidx.textContent = `${current.uv}`
    

    // atmoshepere box population
    humidity.textContent = `${current.humidity}%`;
    windSpeed.textContent = `${current.wind_kph}km/h`;
    windDirection.textContent =`${current.wind_dir}`;
    pressure.textContent = `${data.current.pressure_mb} hPa`;


    // sun and clouds box population
    cloudCover.textContent = `${current.cloud}%`
    sunrise.textContent = astroData.sunrise;
     sunset.textContent = astroData.sunset;
     visibility.textContent = `${data.current.vis_km} km`;

}
// event listener for button
searchBtn.addEventListener("click", () => {
    fetchWeather(cityInput.value.trim());
});

// event listener for input 
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        fetchWeather(cityInput.value.trim());
    }
});


// extra feature for close location weather good feature
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const query = `${position.coords.latitude},${position.coords.longitude}`;
      fetchWeather(query); 
    });
  }
});

// extra feature auto location area weather addded done.
// to add next 3 days weather not done.
// to add switch between fahrenhiet mph and celcius and kph not done.








