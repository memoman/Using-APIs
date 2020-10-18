// comment to add for github
getData();
async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    var count = 1;

    data.sort((a, b) => b.timestamp - a.timestamp);

    for (item of data) {
        if (item.image64) {
            const root = document.createElement('div');
            root.className = "container";
            const left = document.createElement('div');
            left.className = "text-info";
            const mood = document.createElement('div');
            const geo = document.createElement('div');
            const city = document.createElement('div');
            const date = document.createElement('div');
            const temp = document.createElement('div');
            const aqi = document.createElement('div');
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
                temp.innerHTML = `Weather: ${item.desc}, ${item.temp}°F`
                left.append(temp);
            }
            if (item.aqi) {
                aqi.innerHTML = `AQI: ${item.aqi}, ${item.dominentpol}`;
                left.append(aqi);
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
        }

    }
}
