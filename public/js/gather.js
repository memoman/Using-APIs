// comment to add for gitHub
const locations = [
    { loc: "WMS", lat: 29.5878, lon: -98.5411 },
    { loc: "RJS", lat: 42.5452, lon: -83.2429 },
    { loc: "JIS", lat: 41.9168, lon: -87.6761 },
    { loc: "JES", lat: 34.1541, lon: -118.4948 },
    { loc: "JAS", lat: 47.6887, lon: -122.3212 },
    { loc: "CVX", lat: 45.3199, lon: -85.2591 }
]

for (let i = 0; i < locations.length; i++) {
    showLoc(locations[i]);
}
async function showLoc(location) {
    const loc = location.loc;
    const lat = location.lat;
    const lon = location.lon;
    const aqiUrl = `/aqi/?lat=${lat}&lon=${lon}`;
    const aqiresponse = await fetch(aqiUrl)
    const aqidata = await aqiresponse.json();
    const aqi = aqidata.data.aqi;
    const dominentpol = aqidata.data.dominentpol;
    const cityname = aqidata.data.city.name;
    const wxUrl = `/weather/?lat=${lat}&lon=${lon}`;
    const wxresponse = await fetch(wxUrl)
    const wxdata = await wxresponse.json();
    const desc = wxdata.weather[0].description;
    const icon = wxdata.weather[0].icon;
    const temp = wxdata.main.temp
    const data = { loc, lat, lon, temp, desc, icon, aqi, dominentpol, cityname };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    const response = await fetch('/all', options)
    const item = data;
    item.timestamp = Date.now();
    const left = document.createElement('div');
    left.className = "text-info";
    const ref = document.createElement('div');
    const geo = document.createElement('div');
    const city = document.createElement('div');
    const date = document.createElement('div');
    const degrees = document.createElement('div');
    const airq = document.createElement('div');

    ref.textContent = `Reference: ${item.loc}`;
    geo.innerHTML = `Location: ${item.lat}, ${item.lon}`;
    const dateString = new Date(item.timestamp).toLocaleString();
    // const dateString = new Date(item.timestamp);
    date.textContent = dateString;
    left.append(ref, geo);
    if (item.cityname) {
        city.innerHTML = `City: ${item.cityname}`;
        left.append(city);
    }
    left.style.marginBottom = "1em";
    if (item.temp) {
        degrees.innerHTML = `Weather: ${item.desc}, ${item.temp}°F`
        if (item.icon) {
            const pic = document.createElement('img');
            pic.src = `img/${item.icon}@2x.png`;
            pic.style.display = "inline-block";
            degrees.append(pic);
        }
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
    const container = document.getElementById('container');
    container.append(left);
}