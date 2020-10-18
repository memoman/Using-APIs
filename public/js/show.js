getData();
async function getData() {
    const root = document.createElement('div');
    root.className = "loclist"
    const response = await fetch('/all');
    const data = await response.json();
    var count = 1;
    let current = "nothing";
    let locations = []

    for (let i = 0; i < data.length; i++) {
        if (!locations.includes(data[i].loc)) {
            current = data[i].loc;
            locations.push(current);
            const selection = document.createElement('button');
            selection.className = current;
            selection.textContent = current;
            root.append(selection)
        }
    }

    const who = document.getElementById('putithere');
    who.append(root);
    let btns = document.querySelectorAll('button');
    for (btn of btns) {
        btn.addEventListener('click', async function () {
            let whom = this.className;
            const who = document.getElementById('putithere');
            who.innerHTML = ""
            const response = await fetch(`/one?whom=${whom}`);
            const data = await response.json();

            data.sort((a, b) => b.timestamp - a.timestamp);

            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                if (!item.icon) {
                    item.icon = getIcon(item.desc);
                }

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
                who.append(left);

            }
        })
    }

}

function getIcon(conditions) {
    if (conditions == "") {
        return "";
    }
    if (conditions.includes("thunderstorm")) {
        return "11d";
    }
    if (conditions.includes("drizzle")) {
        return "09d";
    }
    if (conditions.includes("freezing rain")) {
        return "13d";
    }
    if (conditions.includes("shower rain")) {
        return "09d";
    }
    if (conditions.includes("rain")) {
        return "10d";
    }
    if (conditions.includes("snow")) {
        return "13d";
    }
    if (conditions.includes("sleet")) {
        return "13d";
    }
    if (conditions.includes("mist")) {
        return "50d";
    }
    if (conditions.includes("Smoke")) {
        return "50d";
    }
    if (conditions.includes("Haze")) {
        return "50d";
    }
    if (conditions.includes("sand")) {
        return "50d";
    }
    if (conditions.includes("fog")) {
        return "50d";
    }
    if (conditions.includes("dust")) {
        return "50d";
    }
    if (conditions.includes("ash")) {
        return "50d";
    }
    if (conditions.includes("squalls")) {
        return "50d";
    }
    if (conditions.includes("tornado")) {
        return "50d";
    }
    if (conditions.includes("clear")) {
        return "01d";
    }
    if (conditions.includes("few clouds")) {
        return "02d";
    }
    if (conditions.includes("scattered clouds")) {
        return "03d";
    }
    if (conditions.includes("clouds")) {
        return "04d";
    }
    return "";
}