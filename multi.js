const express = require("express");
const Datastore = require('nedb');
const fetch = require('node-fetch');
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }))

const database = new Datastore('allover.db');

database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({}).exec((err, data) => {
        if (err) {
            console.log('fucked up ' + err);
            response.end;
            return;
        }
        let count = 0;
        for (item of data) {
            count++;
        }
        console.log(`${count} active records`);
        response.json(data);
    })
})

app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});

app.get('/weather', async (request, response) => {

    let lat = request.query.lat;
    let lon = request.query.lon;
    const wxresponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&APPID=3743816519343317d83606fd44e4c340`)
    const wxdata = await wxresponse.json();
    response.json(wxdata)
})


app.get('/aqi', async (request, response) => {

    let lat = request.query.lat;
    let lon = request.query.lon;
    const token = "5e0edc9e3fc5886884428201c464917612573460"
    const aqiresponse = await fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`)
    const aqidata = await aqiresponse.json();
    response.json(aqidata);
})
