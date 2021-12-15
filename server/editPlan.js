const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const Moment = require('moment');  
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const editPlan = async (req, res) => {
    const {plan, email} = req.body;

    const client = new MongoClient(MONGO_URI, options);
        const db = client.db("AstroPlanner");

    try {
        
        const updatePlanArray = plan.filter((ev) => {
            return !ev.readonly
        })
console.log(updatePlanArray)
        await client.connect();
        
        const update = await db.collection("user").updateOne(
                { email: email },
                { $set: { plans: updatePlanArray } }
            );

        await client.close();
    console.log(update)
        if (update) {
        
            res.status(200).json({ status: 200, message: "Succesfully added objects to session plan" })                    
        } else { 
            return res.status(400).json({ status: 400, message: "Plans conflict with existing ones", data:update});
        }

    } catch (err) {
        console.log(err.stack)
        res.status(500).json({ status: 500, error: err.stack });
    }
};

module.exports = {editPlan}