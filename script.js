document.addEventListener("DOMContentLoaded", () => {
    const icons = new Map([
        ["Clouds", "icons/cloudy.png"],
        ["Drizzle", "icons/drizzle.png"],
        ["Rain", "icons/rain.png"],
        ["Snow", "icons/snow.png"],
        ["Thunderstorm", "icons/storm.png"],
        ["Clear", "icons/sun.png"],
        ["Def", "icons/weather.png"]
    ]);
    const fall = (i, data) => {
        return (fallcheck(data.daily[i].rain) + fallcheck(data.daily[i].snow));
    }
    const apiKey = "2d365453b22c7818f34658ea43b65f15";
    document.getElementById("getWeather").addEventListener("click", getWeather);
    function getWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(fetchWeather);
        } else {
            alert("Twoja przeglądarka nie wspiera geolokacji!");
        }
    }

    function showPosition(position) {
        alert("Latitude: " + position.coords.latitude +
            "Longitude: " + position.coords.longitude);
    }

    async function fetchWeather(position) {
        const temp = `https://api.openweathermap.org/data/3.0/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&exclude=hourly,minutely&units=metric&lang=pl&appid=${apiKey}`;
        try {
            const res = await fetch(temp);
            const data = await res.json();
            if (res.ok) {
                showWeather(data);
            } else {
                alert('City not found. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }
    function showWeather(data) {
        for(let i = 0; i < 4; i++) {
            if(i === 0) {
                showWeatherCurr(data);
            } else {
                showWeatherDay(data, i);
            }
        }
    }
    function showWeatherCurr(data) {
        const coll = document.getElementById("show").children;
        const curr = coll.item(0);
        curr.querySelector("#dayTemp").innerHTML = data.current.temp + "°C";
        curr.querySelector("#wind").innerHTML = data.current.wind_speed + " km/h";
        curr.querySelector("#pres").innerHTML = data.current.pressure + " hPa";
        curr.querySelector("#humid").innerHTML = data.current.humidity + "%";
        curr.querySelector("#rain").innerHTML = fall(0, data) + " mm";
        curr.querySelector("#dayIconImg").setAttribute("src", getIcon(data.daily[0].weather[0].main));
    }
    function showWeatherDay(data, i) {
        const coll = document.getElementById("show").children;
        const curr = coll.item(i);
        curr.querySelector("#dayTemp").innerHTML = data.daily[i].temp.day + "°C";
        curr.querySelector("#wind").innerHTML = data.daily[i].wind_speed + " km/h";
        curr.querySelector("#pres").innerHTML = data.daily[i].pressure + " hPa";
        curr.querySelector("#humid").innerHTML = data.daily[i].humidity + "%";
        curr.querySelector("#rain").innerHTML = fall(i, data) + " mm";
        curr.querySelector("#dayIconImg").setAttribute("src", getIcon(data.daily[i].weather[0].main));
    }
    function getIcon(s) {
        for(const x of icons.keys()){
            if(s === x) {
                return icons.get(x);
            }
        }
        return icons.get("Def");
    }
    function fallcheck(i) {
        if(i){
            return i;
        } else {
            return 0;
        }
    }
});