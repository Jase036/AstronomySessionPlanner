const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;


const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const handleUser = async (req, res) => {
    const user = req.body

    const client = new MongoClient(MONGO_URI, options);
        const db = client.db("AstroPlanner");

    try {
        
        await client.connect();
        const userEntry = await db.collection("user").findOne( {email: user.email })

        if (!userEntry) {
            await db.collection("user").insertOne(user)
            res.status(200).json({ status: 200, message: "User has been added to the database" })
        } else {
            res.status(200).json({ status: 200, message: "User data retrieved from the database" , data: userEntry })
        }
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, error: err.stack });
    }
}

module.exports = { handleUser };