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

const addPlan = async (req, res) => {
    const {selectedObjects, email, date} = req.body
    console.log(date)
    const client = new MongoClient(MONGO_URI, options);
        const db = client.db("AstroPlanner");

    try {
        
        await client.connect();
        const astroPlanObjects = await db.collection("catalog").find( { _id : { $in : selectedObjects } } ).toArray();
        const sessionTime = 15*60;
        const objectTime = Math.floor(sessionTime / selectedObjects.length);
        
        
        let astroPlanEvents= astroPlanObjects.map((object,i) => {
            const startTime = 18*60;
            const objectStart = new Date();
            objectStart.setDate(date)
            objectStart.setHours(18)
            objectStart.setMinutes(0)
            objectStart.setMinutes(objectTime * i)
            
            const objectEnd = new Date();
            objectEnd.setDate(date)
            objectEnd.setHours(18,0,0,0)
            objectEnd.setMinutes(objectTime*(i+1))
            
            return ({
                    start_date: objectStart, 
                    end_date: objectEnd, 
                    text: object.fields.name + " " + (object.fields.common_names ?  object.fields.common_names: " "),
                    id: (Math.floor(Math.random() * 10000) + 1), 
                    notes: "", 
                })
            })
            console.log(astroPlanEvents, 'astroplan')
            const userData = await db.collection("user").findOne({email});
            
            let uniquePlans = []
            if (userData.plans.length !== 0) {
                uniquePlans = astroPlanEvents.filter((obj) => {
                    const startPlan = moment(obj.start_date);
                    const endPlan = moment(obj.end_date);
                    const rangePlan = moment.range(startPlan,endPlan);
                    const overlap = userData.plans.filter((object) => {
                        const startUser = moment(object.start_date);
                        const endUser = moment(object.end_date);
                        const rangeUser = moment.range(startUser,endUser);
                        return rangeUser.overlaps(rangePlan)
                    })
                    return overlap.length === 0
            }) 
            } else {
                uniquePlans = astroPlanEvents
            }
            
            const update = await db.collection("user").updateOne(
                { email: email },
                { $push: { plans: {$each: uniquePlans} } }
              );
            // await db.collection("plans").insertMany(uniquePlans);
            console.log(update)
        await client.close();
    
        if (uniquePlans.length !== 0) {
        
            res.status(200).json({ status: 200, message: "Succesfully added objects to session plan" })                    
        } else { 
            return res.status(400).json({ status: 400, message: "Plans conflict with existing ones" });
        }

    } catch (err) {
        console.log(err.stack)
        res.status(500).json({ status: 500, error: err.stack });
    }
};

module.exports = {addPlan}