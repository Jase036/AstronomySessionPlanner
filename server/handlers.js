const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, W_APP_ID, SG_API_KEY, W_APP_KEY } = process.env;

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const RaDecToAltAz = require ("./RaDecToAltAz")

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

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

        // const astronomyForecastRequest = `https://api.stormglass.io/v2/astronomy/point?lat=${lat}&lng=${lon}&end=${end()}`
        // const responseAstro = await fetch(astronomyForecastRequest, {headers: {
        //     'Authorization': SG_API_KEY
        // }});
        // const dataAstro = await responseAstro.json();

        // if (data && dataAstro) {
        //     const compositeForecast = {...data, ...dataAstro.data}
        //     res.json({ status: 200, forecast: compositeForecast})
        // }  else { 
        //     res.json({ status: 400, data: data, message: `No forecast data found for lat:${lat}, lon:${lon}` })
        // }

        if (data) {
            res.json({ status: 200, forecast: data})
        }  else { 
            res.json({ status: 400, data: data, message: `No forecast data found for lat:${lat}, lon:${lon}` })
        }
    }
    catch (err) {
        console.log(err)
    };
};


const getAstro = async (req, res) => {
    const {lat, lon} = req.query;


    const client = new MongoClient(MONGO_URI, options);
    const db = client.db("AstroPlanner");
    
    try {
        await client.connect();
    
        const astroData = await db.collection("catalog").find().toArray();
    
        await client.close();
    
        if (astroData.length !== 0) {
        
        
        // we need the objects that are visible during the session. So first we get sunrise/sunset
        const forecastRequest = `http://api.weatherunlocked.com/api/forecast/${lat},${lon}?app_id=${W_APP_ID}&app_key=${W_APP_KEY}`
        const response = await fetch(forecastRequest);
        const data = await response.json();
        
        // since we don't really need super specific sunset or rise, we split to get the hour
        
        const {sunrise_time, sunset_time} = data.Days[0]
        const sunriseH = sunrise_time.split('')[0]
        const sunsetH = sunset_time.split('')[0]
        
        //use the hour to set a new date obj for session start. Convert to UTC and add
        // an hour to begin after dusk has passed
        const timeStart = new Date()
        timeStart.setHours(Number(sunsetH + 8))

        //since sessions are overnight, we use the start date and sunrise time to end
        // we also subtract one hour to avoid dawn.
        const timeEnd = new Date()
        timeEnd.setDate(timeStart.getDate()+1)
        timeEnd.setHours(Number(sunriseH + 6))

        //calculate the difference between the two to set the session length
        const sessionLength = Math.floor((timeEnd - timeStart) * 2.7777777777778E-7)
        
        //declare our Astro catalog filtered for objects that will be above the horizon
        let filteredAstro = [];

        //we loop AND filter through the astroData Array to find the objects that
        //will rise above the horizon during our session
        
        for (let i=0; i<sessionLength; i++){

            //We lift these variables to avoid scope issues
            let raH=0;
            let decH=0;
            
            filteredAstro = [...astroData].filter((object) => {
                
                //split the ra so we can convert to decimal hour, we also check to see if the value is negative
                const raArr = object.fields.ra.split(":");
                if (object.fields.ra.charAt(0) == '-') {
                    raH = -Number(raArr[0]) + Number(raArr[1])/60 + Number(raArr[2])/3600
                    raH = -Math.abs(raH)
                } else {
                    raH = Number(raArr[0]) + Number(raArr[1])/60 + Number(raArr[2])/3600
                }

                //same with the dec
                const decArr = object.fields.dec.split(":");
                if (object.fields.dec.charAt(0) == '-') {
                    decH = -Number(decArr[0]) + Number(decArr[1])/60 + Number(decArr[2])/3600
                    decH = -Math.abs(decH)
                } else {
                    decH = Number(decArr[0]) + Number(decArr[1])/60 + Number(decArr[2])/3600
                }

                //create a new instance of the converter class and pass our data
                const AltAzConverter = new RaDecToAltAz(raH,decH, timeStart, lat,lon)
                console.log(AltAzConverter.raDecToAltAz().alt)
                return AltAzConverter.raDecToAltAz().alt > 0
            })
        }
    

        res.status(200).json({ status: 200, data: filteredAstro });
        } else {
        res.status(404).json({ status: 404, error: err.stack });
        }
    } catch (err) {
        res.status(500).json({ status: 500, error: err.stack });
    }
};

module.exports = {getWeather, getAstro}