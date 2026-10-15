// styling elements selections
const loader = document.getElementById("loader"); 
const searchBtn = document.querySelector(".btn");
const cityInput = document.querySelector("#type");
const cityHeader = document.querySelector("#cityname");
const weatherContainer = document.querySelector(".container"); 
const navbarElement = document.querySelector("nav");


// selection for the api key 
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
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const unitToggle = document.getElementById("unit-toggle");



// global required things 
const apiKey = "febd0e70c35a4b4386a145749260710";
let currentUnitSystem = "metric"; // the tooggle buttton is hereee
let cachedWeatherData = null;     


//================================
//  the async function is used here
// ========================================



async function fetchWeather(city) {
    if (!city) return;

    
// getting the api 


    const URL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=3&aqi=no&alerts=no`;
    
    try {
        loader.style.display = "flex";
        weatherContainer.style.display = "none";
        
        const response = await fetch(URL);
        if (!response.ok) throw new Error("no response from the server.");
        
        const data = await response.json();
        cachedWeatherData = data; 
        
        updateUI(data);
        weatherContainer.style.display = "grid";
    } catch (error) {
        console.error("Area exception:", error);
        window.alert("Could not update weather. Please check spelling or your internet connection for more help contact .");
    } finally {
        loader.style.display = "none";
    }
}



// ====
// the ultimate background image changer
// ====



// changes image based on cloud coverage
function updateBackground(cloudValue) {
    let imageUrl = "";

    if (cloudValue <= 20) {
        imageUrl = "sunny.jpg"; // for sunny 
    } else if (cloudValue > 20 && cloudValue <= 50) {
        imageUrl = "partly.jpg"; // for partly cloudy
    } else if (cloudValue > 50 && cloudValue <= 80) {
        imageUrl = "mostly.jpg"; // for mostly cloudy
    } else {
        imageUrl = "rainy.jpg"; // for rainy best picture
    }
    document.body.style.backgroundImage = `linear-gradient(rgba(10, 15, 30, 0.5), rgba(10, 15, 30, 0.5)), url('${imageUrl}')`;
}

// =========
// the data updater dynamic data updating through here.
// ==============


function updateUI(data) {
    const current = data.current;
    const location = data.location;
    const forecastDayList = data.forecast.forecastday;


    // uding index 0 for todays dat fetching
    const dayData = forecastDayList[0].day;
    const astroData = forecastDayList[0].astro;

    const isMetric = currentUnitSystem === "metric";

    // the header text
    cityHeader.textContent = `${location.name}, ${location.country}`;



    //  the toggler and dynamic updater
    if (isMetric) {
        temp.textContent = `${Math.round(current.temp_c)}°C`;
        minTemp.textContent = `${Math.round(dayData.mintemp_c)}°C`;
        maxTemp.textContent = `${Math.round(dayData.maxtemp_c)}°C`;
        feelLike.textContent = `${Math.round(current.feelslike_c)}°C`;
        windSpeed.textContent = `${current.wind_kph} km/h`;
        visibility.textContent = `${current.vis_km} km`;
    } else {
        temp.textContent = `${Math.round(current.temp_f)}°F`;
        minTemp.textContent = `${Math.round(dayData.mintemp_f)}°F`;
        maxTemp.textContent = `${Math.round(dayData.maxtemp_f)}°F`;
        feelLike.textContent = `${Math.round(current.feelslike_f)}°F`;
        windSpeed.textContent = `${current.wind_mph} mph`;
        visibility.textContent = `${current.vis_miles} miles`;
    }


    //static atomsphere the one that doesnt change wether metric or other
    uvidx.textContent = current.uv;
    humidity.textContent = `${current.humidity}%`;
    windDirection.textContent = current.wind_dir;
    pressure.textContent = `${current.pressure_mb} hPa`;

// same but for the sky
    cloudCover.textContent = `${current.cloud}%`;
    sunrise.textContent = astroData.sunrise;
    sunset.textContent = astroData.sunset;
    updateBackground(current.cloud);

 

    // ======
    // the next three days forecast uses javascript to create elemments
    // ======
    if (forecastContainer) {
        forecastContainer.innerHTML = "";
        
        forecastDayList.forEach(dayIndex => {
            const dateObj = new Date(dayIndex.date);
            const displayDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            
// getting it dynamiclly for both matric and imperil
            const fMin = isMetric ? `${Math.round(dayIndex.day.mintemp_c)}°C` : `${Math.round(dayIndex.day.mintemp_f)}°F`;
            const fMax = isMetric ? `${Math.round(dayIndex.day.maxtemp_c)}°C` : `${Math.round(dayIndex.day.maxtemp_f)}°F`;

            const forecastRow = document.createElement("div");
            forecastRow.className = "forecast-row";
            
            forecastRow.innerHTML = `
                <span class="forecast-date">${displayDate}</span>
                <div class="forecast-info">
                    <img class="forecast-icon" src="https:${dayIndex.day.condition.icon}" alt="weather-status">
                    <span class="forecast-condition">${dayIndex.day.condition.text}</span>
                    <span class="forecast-temp-range">⬇️ ${fMin} / ⬆️ ${fMax}</span>
                </div>
            `;
            forecastContainer.appendChild(forecastRow);
        });
    }
}



//  now the event lostener
searchBtn.addEventListener("click", () => {
    fetchWeather(cityInput.value.trim());
});


// input field waiter
cityInput.addEventListener("keypress", (eventObject) => {
    if (eventObject.key === "Enter") {
        fetchWeather(cityInput.value.trim());
    }
});

//  event listenerr for the metric and the imperial
if (unitToggle) {
    unitToggle.addEventListener("click", () => {
        if (currentUnitSystem === "metric") {
            currentUnitSystem = "imperial";
            unitToggle.textContent = "Switch to °C";
        } else {
            currentUnitSystem = "metric";
            unitToggle.textContent = "Switch to °F";
        }
        // Immediately render modifications
        if (cachedWeatherData) {
            updateUI(cachedWeatherData);
        }
    });
}



// beautiful scroll animation

window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
        navbarElement.classList.add("scrolled");
    } else {
        navbarElement.classList.remove("scrolled");
    }
});


//  starting area weather
window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const queryCoordinatesString = `${pos.coords.latitude},${pos.coords.longitude}`;
                fetchWeather(queryCoordinatesString);
            },
            () => {
// if acces bloacked then
                fetchWeather("Gilgit");
            }
        );
    } else {
        fetchWeather("Gilgit");
    }
});


// to do 

// add a toggle =====   done
// change bg based on cloud ========= done
// show forecast =========== done 
// animation when loading ========= done

