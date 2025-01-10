document.addEventListener("DOMContentLoaded", () => {
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
                const div = document.createElement("div");
                var t = document.createTextNode(JSON.stringify(data));
                div.appendChild(t);
                document.getElementById("main").appendChild(div);
            } else {
                alert('City not found. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }
});