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
    const date = (dt) => {
        let s='';
        const temp = new Date(dt * 1000);
        s=s+temp.getDate()+'.'+temp.getMonth()+1;
        return s;
    }
    const apiKey = "2d365453b22c7818f34658ea43b65f15";
    const button1 = document.getElementById("getWeather");
    if(button1) {
        button1.addEventListener("click", getWeather);
    }
    const button2 = document.getElementById("searchBtn");
    if(button2) {
        button2.addEventListener("click", findCity);
    }
    function getWeather() {
        if (navigator.geolocation) {
            var m = document.getElementById("main");
            m.style.display = "none";
            var load = document.getElementById("loader");
            load.style.display = "block";
            navigator.geolocation.getCurrentPosition(pos);
        } else {
            alert("Twoja przeglądarka nie wspiera geolokacji!");
        }
    }
    function pos(position) {
        fetchWeather(position.coords.latitude, position.coords.longitude);
    }
    async function findCity() {
        const searchBox = document.querySelector(".search input");
        const city = searchBox.value;
        const temp = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
        var m = document.getElementById("main");
        m.style.display = "none";
        var load = document.getElementById("loader");
        load.style.display = "block";
        try {
            const res = await fetch(temp);
            const data = await res.json();
            if (res.ok) {
                fetchWeather(data[0].lat, data[0].lon)
            } else {
                alert('Nie znaleziono miasta!');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }
    function showPosition(position) {
        alert("Latitude: " + position.coords.latitude +
            "Longitude: " + position.coords.longitude);
    }

    async function fetchWeather(lat, lon) {
        const temp = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&lang=pl&appid=${apiKey}`;
        try {
            const res = await fetch(temp);
            const data = await res.json();
            if (res.ok) {
                showWeather(data);
            } else {
                alert('Nie znaleziono miasta!');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }
    function showWeather(data) {
        var load = document.getElementById("loader");
        load.style.display = "none";
        for(let i = 0; i < 8; i++) {
            if(i === 0) {
                showWeatherCurr(data);
            } else {
                showWeatherDay(data, i);
            }
        }
        var s = document.getElementById("show");
        s.style.display = "flex";
    }
    function showWeatherCurr(data) {
        const coll = document.getElementById("show").children;
        const curr = coll.item(0);
        curr.querySelector("#dayTemp").innerHTML = data.current.temp + "°C";
        curr.querySelector("#wind").innerHTML = Math.round(data.current.wind_speed) + " km/h";
        curr.querySelector("#pres").innerHTML = data.current.pressure + " hPa";
        curr.querySelector("#humid").innerHTML = data.current.humidity + "%";
        curr.querySelector("#rain").innerHTML = fall(0, data) + " mm";
        curr.querySelector("#dayIconImg").setAttribute("src", getIcon(data.daily[0].weather[0].main));
    }
    function showWeatherDay(data, i) {
        const coll = document.getElementById("show").children;
        const curr = coll.item(i);
        curr.querySelector("#dayTemp").innerHTML = data.daily[i].temp.day + "°C";
        curr.querySelector("#wind").innerHTML = Math.round(data.daily[i].wind_speed) + " km/h";
        curr.querySelector("#pres").innerHTML = data.daily[i].pressure + " hPa";
        curr.querySelector("#humid").innerHTML = data.daily[i].humidity + "%";
        curr.querySelector("#rain").innerHTML = fall(i, data) + " mm";
        curr.querySelector("#dayIconImg").setAttribute("src", getIcon(data.daily[i].weather[0].main));
        curr.querySelector("#dayTitle").innerHTML = date(data.daily[i].dt);
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
    function toggleMenu() {
        const nav = document.querySelector('.nav-links');
        nav.classList.toggle('active');
    }
});