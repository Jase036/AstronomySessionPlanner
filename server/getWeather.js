require("dotenv").config();
const { W_APP_ID, W_APP_KEY, SG_API_KEY } = process.env;

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

//grab the weather data for the next 7 days
const getWeather = async (req, res) => {
    const {lat, lon} = req.query;
    const end = () => {
        const today = new Date();
        const nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
        return nextweek;
    }

    try {
        const forecastRequest = `http://api.weatherunlocked.com/api/forecast/${lat},${lon}?app_id=${W_APP_ID}&app_key=${W_APP_KEY}`
        const response = await fetch(forecastRequest);
        const data = await response.json();

        const astronomyForecastRequest = `https://api.stormglass.io/v2/astronomy/point?lat=${lat}&lng=${lon}&end=${end()}`
        const responseAstro = await fetch(astronomyForecastRequest, {headers: {
            'Authorization': SG_API_KEY
        }});
        const dataAstro = await responseAstro.json();

        if (data && dataAstro) {
            const compositeForecast = {...data, ...dataAstro.data}
            res.json({ status: 200, forecast: compositeForecast})
        }  else { 
            res.json({ status: 400, data: data, message: `No forecast data found for lat:${lat}, lon:${lon}` })
        }

    }
    catch (err) {
        console.log(err)
    };
};

module.exports = { getWeather }