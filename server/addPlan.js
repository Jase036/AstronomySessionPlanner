const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;


const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addPlan = async (req, res) => {
    const selectedObjects = req.body

    const client = new MongoClient(MONGO_URI, options);
        const db = client.db("AstroPlanner");

    try {
        
        await client.connect();
        const astroPlanObjects = await db.collection("catalog").find( { _id : { $in : selectedObjects } } ).toArray();
        const sessionTime = 15*60;
        const objectTime = Math.floor(sessionTime / selectedObjects.length);
        console.log(objectTime, 'oTime')
        
        
        let astroPlanEvents= astroPlanObjects.map((object,i) => {
            const startTime = 18*60;
            const objectStart = new Date();
            objectStart.setHours(18)
            objectStart.setMinutes(0)
            objectStart.setMinutes(objectTime * i)
            console.log(objectStart, 'oStart')
            const objectEnd = new Date();
            objectEnd.setHours(18,0,0,0)
            objectEnd.setMinutes(objectTime*(i+1))
            console.log(objectEnd, 'oEnd')
            return ({
                    start_date: objectStart, 
                    end_date: objectEnd, 
                    text: object.fields.name + " " + (object.fields.common_names ?  object.fields.common_names: " "),
                    id: (Math.floor(Math.random() * 10000) + 1), 
                    notes: "", 
                })
            })
            
            await db.collection("plan").drop(((err, delOK)=> console.log("Dropped!")))
            await db.collection("plan").insertMany(astroPlanEvents);
            
        await client.close();
    
        if (astroPlanEvents.length !== 0) {
        
            res.status(200).json({ status: 200, message: "Succesfully added objects to session plan" })                    
        } else { 
            return res.status(404).json({ status: 404, message: "Not Found", error: err.stack });
        }

    } catch (err) {
        console.log(err.stack)
        res.status(500).json({ status: 500, error: err.stack });
    }
};

module.exports = {addPlan}