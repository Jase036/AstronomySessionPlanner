require("dotenv").config();
const { W_APP_ID, W_APP_KEY, SG_API_KEY, MONGO_URI } = process.env;
const {MongoClient} = require('mongodb');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

//grab the weather data for the next 7 days
const getWeather = async (req, res) => {
    const {lat, lon} = req.query;
    const end = () => {
        const today = new Date();
        const nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
        console.log (nextweek.getUTCDate())
        return nextweek.getUTCDate();
    }

    try {
        const forecastRequest = `http://api.weatherunlocked.com/api/forecast/${lat},${lon}?app_id=${W_APP_ID}&app_key=${W_APP_KEY}`
        const response = await fetch(forecastRequest);
        const data = await response.json();

        const astronomyForecastRequest = `https://api.stormglass.io/v2/astronomy/point?lat=${lat}&lng=${lon}`
        const responseAstro = await fetch(astronomyForecastRequest, {headers: {
            'Authorization': SG_API_KEY
        }});
        const dataAstro = await responseAstro.json();
        
        
        let dayArray = data.Days.flatMap((Days) => {
            
            return (
                Days.Timeframes.map((timeBlock) => {
                    
                    let color = '';
                    if (timeBlock.cloudtotal_pct > 75) {
                        color = "red";
                    } else if (timeBlock.cloudtotal_pct > 50) {
                        color = "crimson";
                    } else if (timeBlock.cloudtotal_pct > 25) {
                        color = "orange";
                    }  else if (timeBlock.cloudtotal_pct > 5) {
                        color = "darkyellow";
                    } else {
                        color = "green";
                    }
                    
                    if (timeBlock.time < 900 || timeBlock.time > 1500 ){

                        const dateArr = timeBlock.date.split('/').reverse();
                        const dateString = dateArr.join('-')
                        
                        let time = '';
                        let fTime = '';
                        switch (timeBlock.time.toString().length) {
                            case 1:
                                time = '00:00'
                                break;
                            case 3:
                                fTime = timeBlock.time.toString().split("");
                                fTime.splice(0, 0, "0");
                                fTime.splice(2, 0, ':');
                                time = fTime.join('');
                                break;
                            case 4:
                                fTime = timeBlock.time.toString().split("");
                                fTime.splice(2, 0, ':');
                                time = fTime.join('');
                                break;
                        }
                        
                        const start_date = dateString + " " + time;
                        
                        let end_date = '';

                        if (time !== "21:00") { 
                            const tArray = time.split(":").map((time, index) => {
                                return index === 0 ? Number(time) + 3 : time;
                                })
                            end_date = dateString + " " + tArray.join(":");

                        } else {
                            const nextDay = dateArr.map((dateEl, index) => {
                                return index === 2 ? Number(dateEl) + 1 : dateEl
                            })
                            end_date = nextDay.join('-') + " 00:00"
                        }

                        return {start_date, end_date, text: "Cloud Cover: " + timeBlock.cloudtotal_pct + '%', _id: (Math.floor(Math.random() * 10000) + 1), color}
                    } else {
                        return {delete: "delete"}
                    }
                    })
            )
        })
        const schedWeatherArray = dayArray.filter(e => !e.delete)

        // creates a new client
        const client = new MongoClient(MONGO_URI, options);
    

        if (data && dataAstro) {
            const compositeForecast = {...data, ...dataAstro.data}

            // connect to the client
        await client.connect();
    
        // connect to the database 
        const db = client.db('AstroPlanner');
        console.log("connected!");

        // create calendar entries for cloud cover
        await db.collection("w_schedule").insertMany(schedWeatherArray);
        
        console.log('Successfully added weather events to collection');
        
        client.close();

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