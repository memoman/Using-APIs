// comment to add for gitHub

function setup() {
    noCanvas();
    const video = createCapture(VIDEO)
    video.size(320, 240);
    const getGeo = document.getElementById("get-geo");
    getGeo.addEventListener('click', async event => {
        let containers = document.getElementsByClassName('container');
        for (let cont = containers.length - 1; cont > -1; cont--) {
            containers[cont].remove();
        }
        const lat = document.getElementById('latitude').textContent;
        const lon = document.getElementById('longitude').textContent;
        const aqiUrl = `/aqi/?lat=${lat}&lon=${lon}`;
        const aqiresponse = await fetch(aqiUrl)
        const aqidata = await aqiresponse.json();
        console.log(aqidata.data)
        const aqi = aqidata.data.aqi;
        const dominentpol = aqidata.data.dominentpol;
        let cityname = aqidata.data.city.name;
        const myFeeling = document.getElementById('my-feeling');
        const feel = myFeeling.value;
        myFeeling.value = "";
        myFeeling.focus();
        video.loadPixels();
        const wxUrl = `/weather/?lat=${lat}&lon=${lon}`;
        const wxresponse = await fetch(wxUrl)
        const wxdata = await wxresponse.json();
        console.log(wxdata)
        const desc = wxdata.weather[0].description
        const temp = wxdata.main.temp
        cityname = wxdata.name;
        const image64 = video.canvas.toDataURL();
        const data = { lat, lon, feel, temp, desc, aqi, dominentpol, cityname, image64 };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        const response = await fetch('/api', options)
        const item = data;
        item.timestamp = Date.now();
        const root = document.createElement('div');
        root.className = "container";
        const left = document.createElement('div');
        left.className = "text-info";
        const mood = document.createElement('div');
        const geo = document.createElement('div');
        const city = document.createElement('div');
        const date = document.createElement('div');
        const degrees = document.createElement('div');
        const airq = document.createElement('div');

        mood.textContent = `Mood: ${item.feel}`;
        geo.innerHTML = `Location: ${item.lat}, ${item.lon}`;
        const dateString = new Date(item.timestamp).toLocaleString();
        date.textContent = dateString;
        left.append(mood, geo);
        if (item.cityname) {
            city.innerHTML = `City: ${item.cityname}`;
            left.append(city);
        }
        root.style.marginBottom = "1em";
        if (item.temp) {
            degrees.innerHTML = `Weather: ${item.desc}, ${item.temp}°F`
            left.append(degrees);
        }
        if (item.aqi) {
            airq.innerHTML = `AQI: ${item.aqi}, ${item.dominentpol}`;
            left.append(airq);
            const spectrum = [
                { a: 0, b: "#cccccc", f: "#ffffff" },
                { a: 50, b: "#009966", f: "#ffffff" },
                { a: 100, b: "#ffde33", f: "#000000" },
                { a: 150, b: "#ff9933", f: "#000000" },
                { a: 200, b: "#cc0033", f: "#ffffff" },
                { a: 300, b: "#660099", f: "#ffffff" },
                { a: 500, b: "#7e0023", f: "#ffffff" },
            ];

            let i = 0;
            for (i = 0; i < spectrum.length - 2; i++) {
                if (item.aqi == "-" || item.aqi <= spectrum[i].a) break;
            }
            left.style.backgroundColor = spectrum[i].b;
            left.style.color = spectrum[i].f;
        }

        left.append(date);
        root.append(left)
        const image = document.createElement('img');
        image.src = item.image64;
        image.alt = "Candid snapshot + count++";
        root.append(image);
        document.body.append(root);
        return response.json();
    });
}
function geoSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    document.getElementById('latitude').textContent = lat;
    document.getElementById('longitude').textContent = lon;
}

function error() {
    alert('Unable to retrieve your location')
}

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(geoSuccess, error);
} else {
    alert('geolocation is NOT available')
}
// setup()

