// import Mongo driver, options and dotenv
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

//handles edits and deletion of events
const editPlan = async (req, res) => {

    //destruc our incoming data
    const {action, ev, id, email} = req.body;

    //Instantiate the Mongo client and select the DB
    const client = new MongoClient(MONGO_URI, options);
        const db = client.db("AstroPlanner");

    try {
        
        //connect and grab the user document from the DB
        await client.connect();
        const userEntry = await db.collection("user").findOne( { email })
        
        let updatePlan = []

        //based on the action we mannipulate the data to
        //replace the plans array in the user document
        switch (action) {
            
            //for manual creation of events
            case 'create':
                updatePlan = [...userEntry.plans]
                updatePlan.push(ev);
                break;
            
            //for notes or date/time changes
            case 'update':
                updatePlan = [...userEntry.plans]
                const updateIndex = [...userEntry.plans].findIndex((e) => e.id == id)
                updatePlan.splice(updateIndex,1, ev);
                break;

            //for deletion of events
            case 'delete':
                updatePlan = [...userEntry.plans]
                const deleteIndex = updatePlan.findIndex((e) => e.id == id)
                if (deleteIndex !== -1) {
                    updatePlan.splice(deleteIndex,1);
                }
                break;

            default :
                break;
        }
        
        //we replace the nested array with the updated one
        const update = await db.collection("user").updateOne(
                { email: email },
                { $set: { plans: updatePlan} }
            );

        //always close the client!
        await client.close();
    
        
        if (update) {
        
            res.status(200).json({ status: 200, message: "Succesfully added objects to session plan" })                    
        } else { 
            return res.status(400).json({ status: 400, message: "Something went wrong", data:update});
        }

    } catch (err) {
        console.log(err.stack)
        res.status(500).json({ status: 500, error: err.stack });
    }
};

module.exports = {editPlan}