const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, W_APP_ID, W_APP_KEY } = process.env;

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getSchedule = async (req, res) => {
    const {email} = req.params
    const client = new MongoClient(MONGO_URI, options);
    const db = client.db("AstroPlanner");

    try {
        await client.connect();
    
        const weatherSchedule = await db.collection("w_schedule").find().toArray();

        const userPlan = await db.collection("user").findOne({email})
        
        const astroPlan = userPlan.plans

        await client.close();
    
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