const express = require("express");
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }))

const database = new Datastore('database.db');
const allover = new Datastore('allover.db');

database.loadDatabase();
allover.loadDatabase();

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
        return;
    })
})

app.get('/all', (request, response) => {
    allover.find({}).exec((err, data) => {
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

app.get('/one', (request, response) => {
    const whom = request.query.whom;
    allover.find({ loc: whom }).exec((err, data) => {
        if (err) {
            console.log('fucked up ' + err);
            response.end;
            return;
        }
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

app.post('/all', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    allover.insert(data);
    response.json(data);
});
app.get('/weather', async (request, response) => {

    let lat = request.query.lat;
    let lon = request.query.lon;
    const api_key = process.env.API_KEY;
    const wxresponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&APPID=${api_key}`)
    const wxdata = await wxresponse.json();
    response.json(wxdata)
})


app.get('/aqi', async (request, response) => {

    let lat = request.query.lat;
    let lon = request.query.lon;
    const token = process.env.AQI_KEY;
    const aqiresponse = await fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`)
    const aqidata = await aqiresponse.json();
    response.json(aqidata);
})
