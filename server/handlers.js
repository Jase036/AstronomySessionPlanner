const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, W_APP_ID, W_API_URL, W_APP_KEY } = process.env;

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


const getWeather = async (req, res) => {
    const {lat, lon} = req.query;

    try {
        const forecastRequest = `${W_API_URL}${lat},${lon}?app_id=${W_APP_ID}&app_key=${W_APP_KEY}`
        const response = await fetch(forecastRequest);
        const data = await response.json();

        if (data) {
            res.json({ status: 200, forecast: data })
        }  else { 
            res.json({ status: 400, data: data, message: `No forecast data found for lat:${lat}, lon:${lon}` })
        }
    }
    catch (err) {
        console.log(err)
    };
};

module.exports = {getWeather}