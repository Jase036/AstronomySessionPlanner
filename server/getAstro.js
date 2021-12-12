const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, W_APP_ID, W_APP_KEY } = process.env;

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const RaDecToAltAz = require ("./RaDecToAltAz")

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getAstro = async (req, res) => {

    const client = new MongoClient(MONGO_URI, options);
    const db = client.db("AstroPlanner");

    const { lat, lon } = req.query;
    let { start, limit } = req.query;

    // Start is starting index for the filtered astro catalog requested.
    // If no limit query is passed we fallback to 25.
    if (!start) {
        start = 0
    } else {
        start = Number(start);
    }

    // The limit represents the number of objects from starting position so we add the starting position.
    // If no limit query is passed we fallback to 25.
    if (!limit) {
       limit = start + 25;
    } else {limit = Number(limit) + start  }
    
    
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
            let loopTime = new Date()
            loopTime.setHours(timeStart.getHours() + i)

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
                const AltAzConverter = new RaDecToAltAz(raH,decH, loopTime, lat,lon)
                return AltAzConverter.raDecToAltAz().alt > 0
            })
        }
            //Some conditional logic to return paginated results and to handle if the limit is greater than the number of results
            if (filteredAstro.length !== 0) {
                res.status(200).json({ status: 200, data: filteredAstro })                    
            } else { 
                return res.status(404).json({ status: 404, message: "Not Found", error: err.stack });
            }
        }

    } catch (err) {
        res.status(500).json({ status: 500, error: err.stack });
    }
};

module.exports = { getAstro }