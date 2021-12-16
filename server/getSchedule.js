// import Mongo driver, options and dotenv
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, W_APP_ID, W_APP_KEY } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

//handles the scheduler request to send the events to the FE
const getSchedule = async (req, res) => {
    //destruct incoming data
    const {email} = req.params

    //Instantiate the Mongo client and select the DB
    const client = new MongoClient(MONGO_URI, options);
    const db = client.db("AstroPlanner");

    try {
        
        //connect and grab the weather event objects along with the user plans
        await client.connect();
        const weatherSchedule = await db.collection("w_schedule").find().toArray();

        const userPlan = await db.collection("user").findOne({email})
        const astroPlan = userPlan.plans

        //always close the client!
        await client.close();
        
        //concat the weather events with the astro object events
        const sessionPlan = astroPlan ? weatherSchedule.concat(astroPlan) : weatherSchedule;
        
        if (weatherSchedule.length !== 0) {
        
            res.status(200).json({ status: 200, data: sessionPlan })                    
        } else { 
            return res.status(404).json({ status: 404, message: "Not Found", error: err.stack });
        }

    } catch (err) {
        res.status(500).json({ status: 500, error: err.stack });
    }
};

module.exports = { getSchedule }