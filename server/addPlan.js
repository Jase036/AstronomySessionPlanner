// import Mongo driver, options and dotenv
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

//import moment and moment range to do some date range intersection calculation
const Moment = require('moment');  
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);


//main function to update the plan array in the user document on MongoDB
const addPlan = async (req, res) => {
    
    //destruct the data coming from FE
    const {selectedObjects, email, date} = req.body
    
    //Instantiate the Mongo client and select the DB
    const client = new MongoClient(MONGO_URI, options);
    const db = client.db("AstroPlanner");

    try {
        
        //connect and grab the catalog objects based on the selected object array
        await client.connect();
        const astroPlanObjects = await db.collection("catalog").find( { _id : { $in : selectedObjects } } ).toArray();
        

        //Set a max session time of 15 hours and then divide that by
        //the number of objects selected
        const sessionTime = 15*60;
        const objectTime = Math.floor(sessionTime / selectedObjects.length);
        

        //map through the objects and create the events that
        //will go on the scheduler
        let astroPlanEvents= astroPlanObjects.map((object,i) => {
            

            //Set the date to the date selected in the FE
            //also set the hour and minute to the beginning of
            //the session then for later objects we multiply by the index
            const objectStart = new Date();
            objectStart.setDate(date)
            objectStart.setHours(18)
            objectStart.setMinutes(0)
            objectStart.setMinutes(objectTime * i)
            

            //we do the same for the end time
            const objectEnd = new Date();
            objectEnd.setDate(date)
            objectEnd.setHours(18,0,0,0)
            objectEnd.setMinutes(objectTime*(i+1))
            

            //format and return our event object
            return ({
                    start_date: objectStart, 
                    end_date: objectEnd, 
                    text: object.fields.name + " " + (object.fields.common_names ?  object.fields.common_names: " "),
                    id: (Math.floor(Math.random() * 10000) + 1), 
                    notes: "", 
                })
            })
            

            //select the signed in user and get their data
            const userData = await db.collection("user").findOne({email});
            

            //we compare the plans stored to the incoming plans to
            //determine if the plans conflict (overlap) with each other
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
            
            //we push the plans to the nested plans array in the 
            //mongo user document
            const update = await db.collection("user").updateOne(
                { email: email },
                { $push: { plans: {$each: uniquePlans} } }
            );
        
        //close the connection!
        await client.close();
    
        //if success or if there was a conflict let the FE know
        if (uniquePlans.length !== 0) {
        
            res.status(200).json({ status: 200, message: "Succesfully added objects to session plan" })                    
        } else { 
            return res.status(400).json({ status: 400, message: "Plans conflict with existing ones", data:update});
        }

    } catch (err) {
        console.log(err.stack)
        res.status(500).json({ status: 500, error: err.stack });
    }
};

module.exports = {addPlan}